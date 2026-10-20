import type { Preview } from '@storybook/react-vite';
import { I18nProvider } from 'react-aria-components';
// Full (non-subset) Pretendard Variable so rendering matches Figma deterministically.
import 'pretendard/dist/web/variable/pretendardvariable.css';
import '../src/styles.css';
import './preview.css';

const preview: Preview = {
  // The design is Korean (Figma "2026년 7월", YYYY.MM.DD): react-aria formats dates and numbers for ko-KR in stories.
  decorators: [
    (Story) => (
      <I18nProvider locale="ko-KR">
        <Story />
      </I18nProvider>
    ),
  ],
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Foundations', ['Design Tokens', 'Focus'],
          'Components', ['*', ['Usage', '*', 'Overview', 'States', 'Variants', 'Gallery', 'Editable Cells', 'Surface Comparison', 'Checks']],
          'Examples', ['Form', 'Dashboard', 'Table List'],
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
