import { useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { Slider as AriaSlider, SliderThumb, SliderTrack } from 'react-aria-components';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { Input } from '../Input';

export type SliderProps = {
  /** 현재 값(제어). */
  value?: number;
  /** 처음 값(비제어). @default minValue */
  defaultValue?: number;
  /** 값이 바뀌는 동안 계속 호출됩니다. */
  onChange?: (value: number) => void;
  /** 드래그를 마치거나, 키를 누르거나, 숫자 입력 칸의 값을 확정하면 호출됩니다. */
  onChangeEnd?: (value: number) => void;
  /** 가장 작은 값. 슬라이더 아래 왼쪽 끝에 보입니다. @default 0 */
  minValue?: number;
  /** 가장 큰 값. 슬라이더 아래 오른쪽 끝에 보입니다. @default 100 */
  maxValue?: number;
  /** 값 사이 간격. @default 1 */
  step?: number;
  /** 슬라이더 오른쪽에 숫자 입력 칸을 보여 줍니다. @default true */
  showInput?: boolean;
  /** 숫자 입력 칸 뒤와 값 라벨에 붙는 단위(예: 명). */
  unit?: ReactNode;
  /** 마우스를 올리거나 드래그하거나 키보드로 선택하면 손잡이 위에 값을 보여 줍니다. @default true */
  valueLabel?: boolean;
  /** 범위 · 값 라벨 · 숫자 입력 칸의 숫자 형식. */
  formatOptions?: Intl.NumberFormatOptions;
  /** 비활성 — 값을 바꿀 수 없습니다. */
  disabled?: boolean;
  /** 폼 필드 이름. */
  name?: string;
  /** 화면 낭독기가 읽는 이름. 보이는 라벨이 없으므로 `aria-label` 또는 `aria-labelledby`가 꼭 필요합니다. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /** 숫자 입력 칸의 이름(화면 낭독기용). @default '값 입력' */
  inputLabel?: string;
  id?: string;
  /** 바깥 요소의 클래스 이름. */
  className?: string;
  /** 바깥 요소의 스타일(예: 너비). */
  style?: CSSProperties;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * 정해진 범위 안에서 숫자 값을 고르는 슬라이더입니다. 마우스 · 터치 · 키보드로 조작하고, 옆의 숫자 입력 칸에
 * 값을 직접 입력할 수도 있습니다. 입력 칸 값은 Enter를 누르거나 다른 곳을 선택하면 확정됩니다.
 */
export function Slider({
  value,
  defaultValue,
  onChange,
  onChangeEnd,
  minValue = 0,
  maxValue = 100,
  step = 1,
  showInput = true,
  unit,
  valueLabel = true,
  formatOptions,
  disabled = false,
  name,
  inputLabel = '값 입력',
  className,
  style,
  ...rest
}: SliderProps) {
  const [current, setCurrent] = useControllableState(value, defaultValue ?? minValue, onChange);
  const format = (n: number) => new Intl.NumberFormat(undefined, { useGrouping: false, ...formatOptions }).format(n);
  // Text being typed in the number field; null when it simply shows the current value.
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    if (draft === null) return;
    setDraft(null);
    const parsed = Number(draft.trim());
    if (draft.trim() === '' || Number.isNaN(parsed)) return;
    const snapped = clamp(Math.round((parsed - minValue) / step) * step + minValue, minValue, maxValue);
    if (snapped !== current) setCurrent(snapped);
    onChangeEnd?.(snapped);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') commit();
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      setDraft(null);
      const next = clamp(current + (event.key === 'ArrowUp' ? step : -step), minValue, maxValue);
      setCurrent(next);
      onChangeEnd?.(next);
    }
  };

  // The number field is as wide as the longest value (Figma: the field hugs "100").
  const digits = Math.max(format(minValue).length, format(maxValue).length);

  return (
    <AriaSlider
      {...rest}
      className={cx('ds-slider', className)}
      style={style}
      value={current}
      onChange={(v) => setCurrent(v as number)}
      onChangeEnd={(v) => onChangeEnd?.(v as number)}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      formatOptions={formatOptions}
      isDisabled={disabled}
    >
      <div className="ds-slider__main">
        <SliderTrack className="ds-slider__track">
          {({ state }) => (
            <>
              <div className="ds-slider__rail">
                <div className="ds-slider__fill" style={{ width: `${state.getThumbPercent(0) * 100}%` }} />
              </div>
              <SliderThumb className="ds-slider__thumb" name={name}>
                <span className="ds-slider__halo" aria-hidden="true" />
                <span className="ds-slider__knob" aria-hidden="true" />
                {valueLabel && (
                  <span className="ds-slider__value-label" aria-hidden="true">
                    <span className="ds-slider__value-text">
                      {state.getThumbValueLabel(0)}
                      {unit}
                    </span>
                  </span>
                )}
              </SliderThumb>
            </>
          )}
        </SliderTrack>
        <div className="ds-slider__range" aria-hidden="true">
          <span className="ds-slider__range-label">{format(minValue)}</span>
          <span className="ds-slider__range-label">{format(maxValue)}</span>
        </div>
      </div>
      {showInput && (
        <div className="ds-slider__entry">
          <Input
            className="ds-slider__input"
            style={{ '--ds-slider-digits': digits } as CSSProperties}
            size="sm"
            clearable={false}
            inputMode="decimal"
            aria-label={inputLabel}
            value={draft ?? String(current)}
            disabled={disabled}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={onInputKeyDown}
          />
          {unit != null && unit !== false && <span className="ds-slider__unit">{unit}</span>}
        </div>
      )}
    </AriaSlider>
  );
}
