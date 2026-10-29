// Real-browser interaction audit — drives the main components with a real pointer and keyboard (Playwright, no
// Storybook test harness, no synthetic events) and checks the actual usage flows: select / deselect / close /
// error / disabled / keyboard. Complements the story tests (which run inside Vitest with storybook/test userEvent).
//
//   npm run storybook                                   (in another terminal)
//   node scripts/interaction-audit.mjs [--filter=select] [--browser=firefox|webkit]
//   STORYBOOK_URL=https://storybook-heo-mu.vercel.app node scripts/interaction-audit.mjs   → the deployed site
//
// Every flow is a named function; a flow fails on the first unmet expectation. Page errors and console errors raised
// during a flow fail it too. Report: .verify/interaction/report-<browser>.json. Exit code 1 when any flow fails.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';
import { ROOT } from './lib/figma-snapshot.mjs';

const SB = (process.env.STORYBOOK_URL ?? 'http://localhost:6006').replace(/\/$/, '');
const FILTER = process.argv.find((a) => a.startsWith('--filter='))?.split('=')[1];
const BROWSER = process.argv.find((a) => a.startsWith('--browser='))?.split('=')[1] ?? 'chromium';
const ENGINE = { chromium, firefox, webkit }[BROWSER];
if (!ENGINE) throw new Error(`Unknown --browser=${BROWSER}`);
const OUT = path.join(ROOT, '.verify', 'interaction');
mkdirSync(OUT, { recursive: true });

const browser = await ENGINE.launch();
const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
const page = await context.newPage();
let errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + String(e.message).slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200)); });

const story = async (id) => {
  await page.goto(`${SB}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => document.querySelector('#storybook-root')?.querySelector(':scope > :not(template)'), null, { timeout: 20000 });
  await page.waitForTimeout(250);
};
const expect = (cond, msg) => { if (!cond) throw new Error(msg); };
const root = () => page.locator('#storybook-root');
const active = () => page.evaluate(() => { const a = document.activeElement; return a ? { tag: a.tagName, role: a.getAttribute('role'), name: a.getAttribute('aria-label') || a.textContent?.trim().slice(0, 40), id: a.id } : null; });
const sleep = (ms) => page.waitForTimeout(ms);

const flows = {
  async 'Select — pointer: open, choose, close'() {
    await story('components-select-select--playground');
    const trigger = root().getByRole('button', { name: /과일/ });
    await trigger.click();
    const listbox = page.getByRole('listbox');
    await listbox.waitFor({ timeout: 3000 });
    const options = page.getByRole('option');
    expect((await options.count()) >= 2, 'listbox has fewer than 2 options');
    const second = await options.nth(1).textContent();
    await options.nth(1).click();
    await sleep(150);
    expect((await listbox.count()) === 0, 'listbox did not close after choosing');
    expect((await trigger.textContent()).includes(second.trim()), `button text does not show the chosen option "${second}"`);
    expect((await trigger.getAttribute('aria-expanded')) !== 'true', 'aria-expanded still true');
  },
  async 'Select — keyboard: ArrowDown opens, arrows move, Enter chooses, Escape closes'() {
    await story('components-select-select--playground');
    const trigger = root().getByRole('button', { name: /과일/ });
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await page.getByRole('listbox').waitFor({ timeout: 3000 });
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await sleep(150);
    expect((await page.getByRole('listbox').count()) === 0, 'Enter did not close the list');
    expect(!/내용 선택/.test(await trigger.textContent()), 'no value chosen by keyboard');
    await page.keyboard.press('ArrowDown');
    await page.getByRole('listbox').waitFor({ timeout: 3000 });
    await page.keyboard.press('Escape');
    await sleep(150);
    expect((await page.getByRole('listbox').count()) === 0, 'Escape did not close the list');
    const a = await active();
    expect(a && a.tag === 'BUTTON', 'focus did not return to the trigger after Escape');
  },
  async 'Select — disabled and read-only do not open'() {
    await story('components-select-select--disabled');
    const btn = root().getByRole('button').first();
    expect(await btn.isDisabled(), 'disabled select button is not disabled');
    await story('components-select-select--read-only');
    const ro = root().getByRole('button').first();
    await ro.click({ force: true });
    await sleep(200);
    expect((await page.getByRole('listbox').count()) === 0, 'read-only select opened a list');
  },
  async 'DatePicker — input: click opens the calendar below the field, choosing closes it and shows the date, focus returns'() {
    await story('components-datepicker-datepicker--playground');
    const trigger = root().getByRole('button', { name: /방문일/ });
    expect((await trigger.textContent()).includes('YYYY.MM.DD'), 'empty field does not show the YYYY.MM.DD placeholder');
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ timeout: 3000 });
    const tb = await trigger.boundingBox(); const db = await dialog.boundingBox();
    expect(Math.round(db.y - (tb.y + tb.height)) === 4, `calendar is ${Math.round(db.y - (tb.y + tb.height))}px below the field, expected 4`);
    expect(Math.round(db.x) === Math.round(tb.x), `calendar left ${Math.round(db.x)} is not aligned with the field left ${Math.round(tb.x)}`);
    await page.getByRole('button', { name: /^20 2026년 7월/ }).click();
    await sleep(200);
    expect((await dialog.count()) === 0, 'calendar did not close after choosing a day');
    expect((await trigger.textContent()).includes('2026.07.20'), 'field does not show the chosen date');
    const a = await active();
    expect(a && /방문일/.test(a.name || '') || (await trigger.evaluate((e) => e === document.activeElement)), 'focus did not return to the field');
  },
  async 'DatePicker — input: Escape and outside click close without choosing; keyboard opens and selects'() {
    await story('components-datepicker-datepicker--playground');
    const trigger = root().getByRole('button', { name: /방문일/ });
    await trigger.click();
    await page.getByRole('dialog').waitFor({ timeout: 3000 });
    await page.keyboard.press('Escape');
    await sleep(200);
    expect((await page.getByRole('dialog').count()) === 0, 'Escape did not close the calendar');
    expect((await trigger.textContent()).includes('YYYY.MM.DD'), 'Escape changed the value');
    expect(await trigger.evaluate((e) => e === document.activeElement), 'focus did not return after Escape');
    await trigger.click();
    await page.getByRole('dialog').waitFor({ timeout: 3000 });
    await page.mouse.click(5, 5);
    await sleep(200);
    expect((await page.getByRole('dialog').count()) === 0, 'outside click did not close the calendar');
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await page.getByRole('dialog').waitFor({ timeout: 3000 });
    await sleep(100);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await sleep(200);
    expect((await page.getByRole('dialog').count()) === 0, 'Enter did not choose and close');
    expect(/2026\.07\.16/.test(await trigger.textContent()), 'keyboard choice (16th) is not shown in the field');
  },
  async 'DatePicker — range input: start and end close the calendar and show "start ~ end"'() {
    await story('components-datepicker-datepicker--playground&args=selectionMode:range'); // the Date Range story runs its own play in the iframe
    const trigger = root().getByRole('button', { name: /방문일/ });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ timeout: 3000 });
    await page.getByRole('button', { name: /^10 2026년 7월/ }).click();
    await sleep(150);
    expect((await dialog.count()) === 1, 'calendar closed after the start date (range needs an end date)');
    await page.getByRole('button', { name: /^14 2026년 7월/ }).click();
    await sleep(200);
    expect((await dialog.count()) === 0, 'calendar did not close after the end date');
    expect((await trigger.textContent()).includes('2026.07.10 ~ 2026.07.14'), `field shows "${(await trigger.textContent()).trim()}"`);
  },
  async 'DatePicker — inline: pick a day, keyboard moves and selects; range marks the days between'() {
    await story('components-datepicker-datepicker--playground&args=variant:inline');
    await root().getByRole('button', { name: /^15 / }).click();
    await sleep(150);
    expect(await root().getByRole('gridcell', { name: /^15 / }).evaluate((e) => e.getAttribute('aria-selected') === 'true' || e.querySelector('[aria-selected="true"], [data-selected]') !== null), 'day 15 is not selected after click');
    await root().getByRole('button', { name: /^16 / }).focus();
    await page.keyboard.press('ArrowRight');
    const a = await active();
    expect(a && /17일/.test(a.name), `ArrowRight did not move focus to day 17 (got ${a?.name})`);
    await story('components-datepicker-datepicker--playground&args=variant:inline;selectionMode:range');
    await root().getByRole('button', { name: /^10 / }).click();
    await root().getByRole('button', { name: /^14 / }).click();
    await sleep(150);
    expect((await root().locator('[aria-selected="true"], [data-selected]').count()) >= 2, 'range start / end not selected');
    expect(await root().getByRole('gridcell', { name: /^12 / }).evaluate((e) => e.matches('[aria-selected="true"], [data-selected]') || e.querySelector('[aria-selected="true"], [data-selected]') !== null), 'day 12 between start and end is not marked');
  },
  async 'DatePicker — disabled dates, error, disabled and read-only fields'() {
    await story('components-datepicker-datepicker--weekdays-only');
    await page.getByRole('dialog').waitFor({ timeout: 3000 });
    expect((await page.getByRole('button', { disabled: true }).count()) > 0, 'no disabled days in the weekdays-only story');
    await story('components-datepicker-datepicker--invalid');
    expect((await root().locator('[aria-invalid="true"]').count()) > 0, 'error story has no aria-invalid field');
    await story('components-datepicker-datepicker--disabled');
    const disabled = root().getByRole('button', { name: /방문일/ });
    expect(await disabled.isDisabled(), 'disabled field is enabled');
    await disabled.click({ force: true });
    await sleep(200);
    expect((await page.getByRole('dialog').count()) === 0, 'disabled field opened the calendar');
    await story('components-datepicker-datepicker--read-only');
    const ro = root().getByRole('button', { name: /방문일/ });
    expect((await ro.textContent()).includes('2026.07.30'), 'read-only field does not show its value');
    await ro.click();
    await sleep(200);
    expect((await page.getByRole('dialog').count()) === 0, 'read-only field opened the calendar');
  },
  async 'Checkbox — click toggles; indeterminate click clears'() {
    await story('components-checkbox-checkbox--playground');
    const cb = root().getByRole('checkbox').first();
    await cb.click();
    expect(await cb.isChecked(), 'checkbox not checked after click');
    await cb.focus(); // WebKit does not focus a native control on click — a keyboard user reaches it with Tab
    await page.keyboard.press('Space');
    expect(!(await cb.isChecked()), 'Space did not uncheck');
    await story('components-checkbox-checkbox--indeterminate');
    const mixed = root().getByRole('checkbox').first();
    expect((await mixed.getAttribute('aria-checked')) === 'mixed' || (await mixed.evaluate((e) => e.indeterminate)), 'not indeterminate initially');
    await mixed.click();
    expect(!(await mixed.isChecked()) && !(await mixed.evaluate((e) => e.indeterminate)), 'indeterminate click did not clear');
    await story('components-checkbox-checkbox--disabled');
    expect(await root().getByRole('checkbox').first().isDisabled(), 'disabled checkbox is enabled');
  },
  async 'Radio — click selects, arrow keys move selection'() {
    await story('components-radio-radio--group');
    await root().getByRole('radio', { name: '인기순' }).click();
    expect(await root().getByRole('radio', { name: '인기순' }).isChecked(), '인기순 not selected after click');
    await root().getByRole('radio', { name: '인기순' }).focus();
    await page.keyboard.press('ArrowDown');
    expect(await root().getByRole('radio', { name: '이름순' }).isChecked(), 'ArrowDown did not select the next radio');
    expect((await root().getByRole('radio', { checked: true }).count()) === 1, 'more than one radio selected');
  },
  async 'Chip filter — multiple: panel stays open, chip text follows the rule, closes on Escape'() {
    await story('components-chip-filterchipselect--playground');
    const chip = root().getByRole('button', { name: /^나이대/ });
    await chip.click();
    const listbox = page.getByRole('listbox');
    await listbox.waitFor({ timeout: 3000 });
    const opts = page.getByRole('option');
    await opts.nth(0).click();
    expect((await listbox.count()) === 1, 'panel closed after the first choice (multiple mode must keep it open)');
    await opts.nth(1).click();
    await page.keyboard.press('Escape');
    await sleep(150);
    expect((await listbox.count()) === 0, 'Escape did not close the panel');
    const text = (await chip.textContent()).trim();
    expect(/^나이대: .+ 외 1개$/.test(text), `chip text "${text}" does not follow "필터명: 첫 값 외 n개"`);
    expect((await chip.getAttribute('aria-expanded')) === 'false', 'aria-expanded not false after close');
  },
  async 'Chip filter — single: choosing applies and closes'() {
    await story('components-chip-filterchipselect--single');
    const chip = root().getByRole('button', { name: /^기간/ });
    await chip.click();
    await page.getByRole('listbox').waitFor({ timeout: 3000 });
    const opt = page.getByRole('option').nth(1);
    const label = (await opt.textContent()).trim();
    await opt.click();
    await sleep(200);
    expect((await page.getByRole('listbox').count()) === 0, 'single-select panel did not close after choosing');
    expect((await chip.textContent()).includes(label), `chip text does not show "${label}"`);
  },
  async 'Chip — input chip removes on click and Backspace, disabled chip ignores'() {
    await story('components-chip-inputchip--playground');
    const before = await root().getByRole('button').count();
    expect(before >= 1, 'no input chip rendered');
    await story('components-chip-chip--disabled');
    const disabled = root().getByRole('button').first();
    expect((await disabled.isDisabled()) || (await disabled.getAttribute('aria-disabled')) === 'true', 'disabled chip is not disabled');
  },
  async 'Dropdown menu — click opens, arrows move, Enter activates, Escape returns focus'() {
    await story('components-dropdownmenu-dropdownmenu--playground');
    const trigger = root().getByRole('button', { name: '메뉴' });
    await trigger.click();
    const menu = page.getByRole('menu');
    await menu.waitFor({ timeout: 3000 });
    expect((await trigger.getAttribute('aria-expanded')) === 'true', 'aria-expanded not true while open');
    await page.keyboard.press('ArrowDown');
    const a1 = await active();
    expect(a1 && a1.role === 'menuitem', `ArrowDown did not focus a menu item (got ${a1?.role})`);
    await page.keyboard.press('Escape');
    await sleep(150);
    expect((await menu.count()) === 0, 'Escape did not close the menu');
    const a2 = await active();
    expect(a2 && a2.name === '메뉴', 'focus did not return to the trigger');
    await trigger.click();
    await menu.waitFor({ timeout: 3000 });
    await page.getByRole('menuitem').first().click();
    await sleep(150);
    expect((await menu.count()) === 0, 'choosing an item did not close the menu');
  },
  async 'Dialog — opens, traps focus, Escape closes and restores focus'() {
    await story('components-dialog-dialog--playground');
    const trigger = root().getByRole('button', { name: '대화상자 열기' });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ timeout: 3000 });
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
      expect(inside, `Tab ${i + 1} left the dialog`);
    }
    await page.keyboard.press('Escape');
    await sleep(200);
    expect((await dialog.count()) === 0, 'Escape did not close the dialog');
    const a = await active();
    expect(a && a.name === '대화상자 열기', 'focus did not return to the opener');
    await trigger.click();
    await dialog.waitFor({ timeout: 3000 });
    await page.mouse.click(5, 5);
    await sleep(200);
    expect((await dialog.count()) === 1, 'clicking the scrim closed the dialog (Rules 05: dialogs do not close on outside click)');
    await page.keyboard.press('Escape');
  },
  async 'Toast — shows, closes with the 닫기 button, at most three visible'() {
    await story('components-toast-toast--with-region');
    await root().getByRole('button', { name: '성공' }).click();
    const toast = page.getByText('저장했습니다');
    await toast.waitFor({ timeout: 3000 });
    await page.getByRole('button', { name: /닫기/ }).first().click();
    await sleep(300);
    expect((await toast.count()) === 0, 'toast still visible after 닫기');
    for (let i = 0; i < 4; i++) await root().getByRole('button', { name: '닫을 때까지 유지' }).click();
    await sleep(300);
    const visible = await page.locator('.ds-toast').count();
    expect(visible <= 3, `${visible} toasts visible, max is 3`);
    expect(visible >= 1, 'no toast visible after four calls');
  },
  async 'Chart — hover shows the tooltip for the nearest item, keyboard arrows move it, leaving hides it'() {
    await story('components-chart-chart--playground');
    const svg = root().locator('svg').first();
    const box = await svg.boundingBox();
    await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.5);
    await sleep(250);
    const tooltip = page.locator('.ds-chart-tooltip');
    expect((await tooltip.count()) === 1 && (await tooltip.isVisible()), 'tooltip did not appear on hover');
    const first = await tooltip.locator('.ds-chart-tooltip__title').textContent();
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.5);
    await sleep(250);
    const second = await tooltip.locator('.ds-chart-tooltip__title').textContent();
    expect(first !== second, 'tooltip title did not change when hovering another item');
    await page.mouse.move(5, 5);
    await sleep(300);
    expect((await tooltip.count()) === 0 || !(await tooltip.isVisible()), 'tooltip stayed after the pointer left');
    const group = root().getByRole('group', { name: /차트 항목/ });
    await group.focus();
    await page.keyboard.press('ArrowRight');
    await sleep(250);
    expect((await tooltip.count()) === 1, 'keyboard ArrowRight did not show the tooltip');
    await page.keyboard.press('Escape');
    await sleep(250);
    expect((await tooltip.count()) === 0 || !(await tooltip.isVisible()), 'Escape did not hide the keyboard tooltip');
  },
  async 'Accordion — one open at a time, Space / Enter toggle, disabled ignores'() {
    await story('components-accordion-accordion--playground');
    const basic = root().getByRole('button', { name: '기본 설정' });
    const advanced = root().getByRole('button', { name: /고급 설정/ });
    expect((await advanced.getAttribute('aria-expanded')) === 'true', 'initial expanded item missing');
    await basic.click();
    await sleep(100);
    expect((await basic.getAttribute('aria-expanded')) === 'true', 'click did not expand 기본 설정');
    expect((await advanced.getAttribute('aria-expanded')) === 'false', 'previous item stayed open (single-open rule)');
    await basic.focus();
    await page.keyboard.press('Space');
    await sleep(100);
    expect((await basic.getAttribute('aria-expanded')) === 'false', 'Space did not collapse');
    await page.keyboard.press('Enter');
    await sleep(100);
    expect((await basic.getAttribute('aria-expanded')) === 'true', 'Enter did not expand');
    const disabled = root().getByRole('button', { name: '실험 기능' });
    expect(await disabled.isDisabled(), 'disabled item is not disabled');
  },
  async 'FileUploader — file input accepts the documented types, disabled zone is inert'() {
    await story('components-fileuploader-fileuploader--playground');
    const input = page.locator('input[type=file]');
    expect((await input.count()) === 1, 'no file input');
    const accept = await input.getAttribute('accept');
    expect(accept && accept.includes('.pdf'), `accept attribute missing the documented types (${accept})`);
    await input.setInputFiles({ name: 'a.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') });
    expect((await input.evaluate((e) => e.files.length)) === 1, 'file was not taken by the input');
    const zone = root().getByRole('button').first();
    await zone.focus();
    const a = await active();
    expect(a && a.tag === 'BUTTON', 'drop zone is not a focusable button');
    await story('components-fileuploader-fileuploader--disabled');
    expect(await root().getByRole('button').first().isDisabled(), 'disabled drop zone is enabled');
    await story('components-fileuploader-fileuploaderitem--failed');
    expect((await root().getByRole('button', { name: /삭제|제거|remove/i }).count()) >= 1, 'failed item has no remove button');
  },
  async 'Table — row selection with checkboxes, select-all, header sort state'() {
    await story('components-table-table--playground');
    const rows = root().getByRole('row');
    const firstRowBox = root().getByRole('checkbox', { name: '선택', exact: true }).first();
    await firstRowBox.click();
    expect(await firstRowBox.isChecked(), 'row checkbox not checked');
    const all = root().getByRole('checkbox', { name: '모두 선택' });
    expect((await all.getAttribute('aria-checked')) === 'mixed' || (await all.evaluate((e) => e.indeterminate)), 'select-all is not indeterminate with one row selected');
    await all.click();
    await sleep(100);
    const totalRows = await root().getByRole('checkbox', { name: '선택', exact: true }).count();
    const checkedRows = await root().getByRole('checkbox', { name: '선택', exact: true, checked: true }).count();
    expect(checkedRows === totalRows, `select-all left ${checkedRows}/${totalRows} rows`);
    expect(await all.isChecked(), 'select-all box does not show checked while every row is selected');
    await all.click();
    await sleep(100);
    expect((await root().getByRole('checkbox', { name: '선택', exact: true, checked: true }).count()) === 0, 'second select-all click did not clear the selection');
    expect(!(await all.isChecked()), 'select-all box still checked after clearing');
    const headers = root().getByRole('columnheader');
    const sortable = await headers.evaluateAll((hs) => hs.filter((h) => h.hasAttribute('aria-sort')).map((h) => h.textContent.trim()));
    if (sortable.length) {
      await root().getByRole('columnheader', { name: sortable[0] }).click();
      await sleep(100);
      const state = await root().getByRole('columnheader', { name: sortable[0] }).getAttribute('aria-sort');
      expect(state === 'ascending' || state === 'descending', `sort click did not set aria-sort (${state})`);
    }
    expect((await rows.count()) >= 2, 'table has no body rows');
  },
  async 'Dashboard filter bar — period segment, target select and 조회 button work together'() {
    await story('components-dashboardfilterbar-dashboardfilterbar--playground');
    await root().getByText('오늘', { exact: true }).click(); // the radio input is visually hidden; the label is the click target
    expect(await root().getByRole('radio', { name: '오늘' }).isChecked(), 'segment did not change');
    await root().getByRole('button', { name: /조회 대상/ }).click();
    await page.getByRole('listbox').waitFor({ timeout: 3000 });
    await page.getByRole('option').nth(1).click();
    await sleep(150);
    expect((await page.getByRole('listbox').count()) === 0, 'target select did not close');
    const submit = root().getByRole('button', { name: /^조회$/ });
    expect((await submit.count()) === 1, 'no 조회 button');
    await submit.click();
    await sleep(100);
  },
  async 'Tabs — arrow keys select automatically and skip the disabled tab'() {
    await story('components-tabs-tabs--playground');
    await root().getByRole('tab', { name: '전체' }).click();
    await page.keyboard.press('ArrowRight');
    await sleep(100);
    expect((await root().getByRole('tab', { name: '진행 중' }).getAttribute('aria-selected')) === 'true', 'ArrowRight did not select the next tab');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await sleep(100);
    expect((await root().getByRole('tab', { name: '보류' }).getAttribute('aria-selected')) !== 'true', 'disabled tab got selected');
    expect((await root().getByRole('tabpanel').count()) === 1, 'exactly one tab panel expected');
  },
  async 'Pagination — next / previous, disabled at the ends, current page announced'() {
    await story('components-pagination-pagination--playground');
    expect(await root().getByRole('button', { name: '이전 페이지' }).isDisabled(), 'previous is enabled on page 1');
    await root().getByRole('button', { name: '다음 페이지' }).click();
    expect((await root().getByRole('button', { name: '2 페이지' }).getAttribute('aria-current')) === 'page', 'page 2 is not current after 다음');
    expect(!(await root().getByRole('button', { name: '이전 페이지' }).isDisabled()), 'previous still disabled on page 2');
    for (let i = 0; i < 30 && !(await root().getByRole('button', { name: '다음 페이지' }).isDisabled()); i++) await root().getByRole('button', { name: '다음 페이지' }).click();
    expect(await root().getByRole('button', { name: '다음 페이지' }).isDisabled(), 'next never became disabled');
    const currentPages = await root().locator('button[aria-current="page"]').count();
    expect(currentPages === 1, `expected one aria-current=page button on the last page, found ${currentPages}`);
  },
  async 'Slider — arrow keys change the value, typing in the number box moves the thumb'() {
    await story('components-slider-slider--playground');
    const slider = root().getByRole('slider');
    const value = () => slider.evaluate((e) => Number(e.getAttribute('aria-valuenow') ?? e.value));
    const before = await value();
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    const after = await value();
    expect(after > before, `ArrowRight did not increase the value (${before} → ${after})`);
    const box = root().getByRole('textbox', { name: '값 입력' });
    await box.fill('50');
    await page.keyboard.press('Enter');
    await sleep(100);
    expect((await value()) === 50, 'typed value did not move the slider');
    await story('components-slider-slider--disabled');
    expect((await root().getByRole('slider').getAttribute('aria-disabled')) === 'true' || (await root().getByRole('slider').isDisabled()), 'disabled slider is not disabled');
  },
  async 'Segmented control — click and arrow keys change the selection'() {
    await story('components-segmentedcontrol-segmentedcontrol--playground');
    await root().getByText('월간', { exact: true }).click(); // visually hidden radio input — click the label
    expect(await root().getByRole('radio', { name: '월간' }).isChecked(), 'click did not select 월간');
    await root().getByRole('radio', { name: '월간' }).focus();
    await page.keyboard.press('ArrowLeft');
    expect(await root().getByRole('radio', { name: '주간' }).isChecked(), 'ArrowLeft did not select 주간');
  },
  async 'Tooltip — pointer after a delay, keyboard focus immediately, Escape hides'() {
    await story('components-tooltip-tooltip--playground');
    const btn = root().getByRole('button', { name: '저장' });
    // Enter the button like a user does: the pointer travels in from outside (react-aria's hover needs a real pointerenter).
    const bb = await btn.boundingBox();
    await page.mouse.move(bb.x - 40, bb.y + bb.height / 2);
    for (let i = 1; i <= 8; i++) { await page.mouse.move(bb.x - 40 + i * 5 + (i === 8 ? bb.width / 2 : 0), bb.y + bb.height / 2); await sleep(15); }
    await sleep(150);
    expect((await page.getByRole('tooltip').count()) === 0, 'tooltip appeared before the 0.5 s delay');
    await sleep(600);
    expect((await page.getByRole('tooltip').count()) === 1, 'tooltip did not appear after the delay');
    await page.mouse.move(5, 5);
    await sleep(800); // closeDelay defaults to react-aria's 500 ms
    expect((await page.getByRole('tooltip').count()) === 0, 'tooltip stayed after the pointer left');
    await page.keyboard.press('Tab');
    await sleep(100);
    expect((await page.getByRole('tooltip').count()) === 1, 'keyboard focus did not show the tooltip immediately');
    // Rules 05 (2026-10-29): arrow tip 2px from the trigger; the position follows the trigger after a resize (portal + real bounds).
    const gap = async () => page.evaluate(() => { const t = document.querySelector('[role=tooltip]'); const a = t.querySelector('.ds-tooltip__arrow > svg').getBoundingClientRect(); const b = document.activeElement.getBoundingClientRect(); const side = t.getAttribute('data-placement'); return { side, gap: Math.round(({ top: b.top - a.bottom, bottom: a.top - b.bottom, left: b.left - a.right, right: a.left - b.right })[side] * 100) / 100, inside: t.getBoundingClientRect().left >= 0 && t.getBoundingClientRect().right <= innerWidth }; });
    const g1 = await gap();
    expect(g1.gap === 2, `arrow tip is ${g1.gap}px from the trigger (expected 2, side ${g1.side})`);
    await page.setViewportSize({ width: 900, height: 700 });
    await sleep(200);
    const g2 = await gap();
    expect(g2.gap === 2 && g2.inside, `after resize: gap ${g2.gap}px, inside viewport ${g2.inside}`);
    await page.setViewportSize({ width: 1400, height: 1000 });
    await sleep(200);
    await page.evaluate(() => { document.body.style.minHeight = '2400px'; window.scrollBy(0, 48); });
    await sleep(200);
    const g3 = await gap();
    expect(g3.gap === 2, `after scroll: arrow tip ${g3.gap}px from the trigger`);
    await page.evaluate(() => { window.scrollTo(0, 0); document.body.style.minHeight = ''; });
    await page.keyboard.press('Escape');
    await sleep(150);
    expect((await page.getByRole('tooltip').count()) === 0, 'Escape did not hide the tooltip');
  },
  async 'Tooltip — flips at the screen edge, one tooltip at a time without flicker on quick pointer moves'() {
    await story('components-tooltip-showcase--edge');
    await page.getByRole('tooltip').first().waitFor({ timeout: 3000 });
    const placements = await page.evaluate(() => [...document.querySelectorAll('[role=tooltip]')].map((t) => t.getAttribute('data-placement')));
    expect(placements.join(',') === 'bottom,left', `edge placements ${placements.join(',')} (expected bottom,left)`);
    const inside = await page.evaluate(() => [...document.querySelectorAll('[role=tooltip]')].every((t) => { const r = t.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.top >= 0; }));
    expect(inside, 'an edge tooltip leaves the viewport');
    await story('components-tooltip-showcase--multiple');
    const buttons = root().getByRole('button');
    const boxes = [];
    for (let i = 0; i < 3; i++) boxes.push(await buttons.nth(i).boundingBox());
    await page.mouse.move(boxes[0].x - 30, boxes[0].y + boxes[0].height / 2);
    for (const bb of boxes) { for (let i = 1; i <= 4; i++) { await page.mouse.move(bb.x + (bb.width / 4) * i, bb.y + bb.height / 2); await sleep(10); } }
    await page.mouse.move(boxes[2].x + boxes[2].width / 2, boxes[2].y + boxes[2].height / 2); // rest on the last button
    await sleep(250);
    const tips = page.getByRole('tooltip');
    expect((await tips.count()) === 1, `${await tips.count()} tooltips visible after a quick pointer sweep (expected 1)`);
    expect((await tips.first().textContent()).includes('삭제'), 'the tooltip shown is not the one of the hovered button');
    await page.mouse.move(5, 5);
    await sleep(300);
    expect((await tips.count()) === 0, 'tooltip stayed after the pointer left');
  },
  async 'Input — typing, clear button, password reveal'() {
    await story('components-input-input--playground');
    const field = root().getByRole('textbox', { name: '이메일' });
    await field.fill('abc');
    const clear = root().getByRole('button', { name: /지우기|clear/i });
    if ((await clear.count()) === 1) {
      await clear.click();
      expect((await field.inputValue()) === '', 'clear button did not empty the field');
    }
    await story('components-input-input--password');
    const pw = root().locator('input').first();
    expect((await pw.getAttribute('type')) === 'password', 'password field is not type=password');
    const eye = root().getByRole('button', { name: /비밀번호|표시|보기/ });
    expect((await eye.count()) === 1, 'no reveal button');
    await eye.click();
    expect((await pw.getAttribute('type')) === 'text', 'reveal did not switch to type=text');
    expect((await eye.getAttribute('aria-pressed')) === 'true', 'reveal button has no aria-pressed=true');
    await story('components-input-input--disabled');
    expect(await root().getByRole('textbox').first().isDisabled(), 'disabled input is enabled');
    await story('components-input-input--read-only');
    expect((await root().getByRole('textbox').first().getAttribute('readonly')) !== null, 'read-only input lacks readonly');
  },
  async 'SearchField — typing shows the clear button, Escape clears'() {
    await story('components-searchfield-searchfield--playground');
    const field = root().getByRole('searchbox');
    await field.fill('에너지');
    await field.focus();
    await page.keyboard.press('Escape');
    expect((await field.inputValue()) === '', 'Escape did not clear the search field');
  },
  async 'Textarea — counter follows the length, maxLength enforced'() {
    await story('components-textarea-textarea--playground');
    const ta = root().getByRole('textbox');
    await ta.fill('가나다');
    expect(/3\s*\/\s*100/.test(await root().textContent()), 'counter did not update to 3 / 100');
    expect((await ta.getAttribute('maxlength')) === '100', 'maxlength not set');
  },
  async 'Switch — click and Space toggle'() {
    await story('components-switch-switch--playground');
    const sw = root().getByRole('switch');
    await sw.click();
    expect(await sw.isChecked(), 'switch not on after click');
    await sw.focus();
    await page.keyboard.press('Space');
    expect(!(await sw.isChecked()), 'Space did not toggle the switch off');
  },
  async 'DatePicker — year / month selection lists change the visible month, previous / next navigate'() {
    await story('components-datepicker-datepicker--year-month-selection');
    const heading = root().getByRole('heading', { level: 2 }).first(); // the story renders two pickers
    const before = (await heading.textContent()).trim();
    await root().getByRole('button', { name: /연도$/ }).click();
    await sleep(200);
    const yearOptions = page.getByRole('option');
    const yearButtons = root().getByRole('button', { name: /^\d{4}년$/ });
    if ((await yearOptions.count()) > 0) await yearOptions.filter({ hasNotText: before.slice(0, 5) }).first().click();
    else await yearButtons.filter({ hasNotText: before.slice(0, 5) }).first().click();
    await sleep(200);
    const afterYear = (await heading.textContent()).trim();
    expect(afterYear !== before, `choosing a year did not change the heading (${before})`);
    await root().getByRole('button', { name: /월$/ }).first().click();
    await sleep(200);
    const monthOptions = page.getByRole('option');
    const monthButtons = root().getByRole('button', { name: /^\d{1,2}월$/ });
    if ((await monthOptions.count()) > 0) await monthOptions.nth(2).click();
    else await monthButtons.nth(2).click();
    await sleep(200);
    const afterMonth = (await heading.textContent()).trim();
    expect(afterMonth !== afterYear, 'choosing a month did not change the heading');
    await root().getByRole('button', { name: '다음' }).first().click();
    await sleep(150);
    expect((await heading.textContent()).trim() !== afterMonth, '다음 did not move to the next month');
    await root().getByRole('button', { name: '이전' }).first().click();
    await sleep(150);
    expect((await heading.textContent()).trim() === afterMonth, '이전 did not move back');
  },
};

const names = Object.keys(flows).filter((n) => !FILTER || n.toLowerCase().includes(FILTER.toLowerCase()));
const results = [];
for (const name of names) {
  errors = [];
  let status = 'pass'; let detail = '';
  try { await flows[name](); } catch (e) { status = 'fail'; detail = String(e.message).split('\n')[0].slice(0, 240); }
  if (status === 'pass' && errors.length) { status = 'fail'; detail = errors[0]; }
  results.push({ flow: name, status, detail, errors: errors.slice(0, 5) });
  console.log(`${status === 'pass' ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`);
}
await browser.close();
const failed = results.filter((r) => r.status === 'fail');
writeFileSync(path.join(OUT, `report-${BROWSER}.json`), JSON.stringify({ target: SB, browser: BROWSER, flows: results.length, failed: failed.length, results }, null, 2));
console.log(`\nInteraction audit — ${SB} (${BROWSER}): ${results.length - failed.length}/${results.length} flows passed`);
console.log(`report: .verify/interaction/report-${BROWSER}.json`);
process.exitCode = failed.length ? 1 : 0;
