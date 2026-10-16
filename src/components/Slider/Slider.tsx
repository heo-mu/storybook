import { useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { Slider as AriaSlider, SliderThumb, SliderTrack } from 'react-aria-components';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { Input } from '../Input';

export type SliderProps = {
  /** Current value (controlled). */
  value?: number;
  /** Initial value (uncontrolled). @default minValue */
  defaultValue?: number;
  /** Called continuously while the value changes. */
  onChange?: (value: number) => void;
  /** Called when the user finishes a change (pointer up, key press, input committed). */
  onChangeEnd?: (value: number) => void;
  /** Smallest value, shown at the left end of the range row. @default 0 */
  minValue?: number;
  /** Largest value, shown at the right end of the range row. @default 100 */
  maxValue?: number;
  /** Step between values. @default 1 */
  step?: number;
  /** Figma "Show Input": number field next to the slider. @default true */
  showInput?: boolean;
  /** Unit after the number field and in the value label (Figma "명"). */
  unit?: ReactNode;
  /** Figma handle "Value Label": value tag above the handle on hover, drag and keyboard focus. @default true */
  valueLabel?: boolean;
  /** Number formatting of the range labels, value label and field. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Figma State "Disabled". */
  disabled?: boolean;
  /** Form field name (the slider's range input). */
  name?: string;
  /** Accessible name — Figma shows no label, so one of `aria-label` / `aria-labelledby` is required. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /** Accessible name of the number field. @default '값 입력' */
  inputLabel?: string;
  id?: string;
  /** Class name of the root element. */
  className?: string;
  /** Style of the root element (e.g. its width). */
  style?: CSSProperties;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * Figma component set `slider` (391:1988) with `handle` (391:2013). Pointer, touch and keyboard
 * (arrows, Page Up / Down, Home / End) come from react-aria-components; the optional number field
 * (Figma "Show Input") is the Input component and commits on Enter or blur.
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
