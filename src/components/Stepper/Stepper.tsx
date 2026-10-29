import { forwardRef, useEffect, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { CheckIcon, ExclamationMarkIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { usePrefersReducedMotion } from '../../utils/usePrefersReducedMotion';
import type { StepperOrientation, StepperStatus } from './Stepper.options';

/** Text read by screen readers for states that are shown only by colour or icon. */
const STATUS_TEXT: Partial<Record<StepperStatus, string>> = { completed: '완료', error: '오류', locked: '잠김' };

export type StepperIndicatorProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** 단계 상태. @default 'upcoming' */
  status?: StepperStatus;
  /** 원 안에 보이는 단계 번호(`upcoming` · `current` · `locked`일 때). */
  step: number;
  /** 단계 제목. */
  label?: ReactNode;
  /** 제목 아래 설명. */
  description?: ReactNode;
  /** 방향 — 가로이면 글자가 원 아래, 세로이면 원 옆에 놓입니다. @default 'horizontal' */
  orientation?: StepperOrientation;
  /**
   * 화면에 그리는 상태(색 · 아이콘). 단계가 바뀌는 움직임 동안 `Stepper`가 넘기며, 화면 낭독기는 `status`를 읽습니다.
   * @default status
   */
  displayStatus?: StepperStatus;
};

/**
 * 단계 하나를 나타내는 원과 글자입니다. 원 안에는 번호가 보이고, 완료이면 체크 아이콘, 오류이면 경고 아이콘이 보입니다.
 * `Stepper`가 안에서 그립니다.
 * @internal Rendered by `Stepper` — use that (docs/public-api.md).
 */
export const StepperIndicator = forwardRef<HTMLDivElement, StepperIndicatorProps>(function StepperIndicator(
  { status = 'upcoming', displayStatus, step, label, description, orientation = 'horizontal', className, ...rest },
  ref,
) {
  const hasLabel = label != null && label !== false;
  const hasDescription = description != null && description !== false;
  const shown = displayStatus ?? status;
  return (
    <div {...rest} ref={ref} className={cx('ds-stepper-indicator', className)} data-status={shown} data-orientation={orientation}>
      <span className="ds-stepper-indicator__circle" aria-hidden="true">
        {shown === 'completed' ? (
          <CheckIcon className="ds-stepper-indicator__icon" />
        ) : shown === 'error' ? (
          <ExclamationMarkIcon className="ds-stepper-indicator__icon" />
        ) : (
          <span className="ds-stepper-indicator__number">{step}</span>
        )}
      </span>
      {(hasLabel || hasDescription) && (
        <span className="ds-stepper-indicator__content">
          {hasLabel && <span className="ds-stepper-indicator__label">{label}</span>}
          {hasDescription && <span className="ds-stepper-indicator__description">{description}</span>}
        </span>
      )}
      <span className="ds-stepper__sr">
        {`${step}단계`}
        {STATUS_TEXT[status] ? `, ${STATUS_TEXT[status]}` : ''}
      </span>
    </div>
  );
});

export type StepperConnectorProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  /** 완료 모양으로 그릴지 여부. @default false */
  completed?: boolean;
  /** 방향. @default 'horizontal' */
  orientation?: StepperOrientation;
};

/**
 * 단계 사이를 잇는 선입니다. `Stepper`가 안에서 그립니다.
 * @internal Rendered by `Stepper` — use that (docs/public-api.md).
 */
export function StepperConnector({ completed = false, orientation = 'horizontal', className, ...rest }: StepperConnectorProps) {
  return (
    <span {...rest} className={cx('ds-stepper-connector', className)} data-orientation={orientation} data-completed={completed || undefined} aria-hidden="true">
      {/* Track (incomplete colour) and fill (complete colour) split the same 1px line; Rules 09 fills it from the
          previous step towards the next (Stepper.css). At rest only one of them is visible. */}
      <svg className="ds-stepper-connector__line" focusable="false">
        <rect className="ds-stepper-connector__track" />
        <rect className="ds-stepper-connector__fill" />
      </svg>
    </span>
  );
}

export type StepperStep = {
  /** 단계 제목. */
  label?: ReactNode;
  /** 제목 아래 설명. */
  description?: ReactNode;
  /** 단계 상태를 직접 정합니다(예: 'locked', 'error'). 없으면 `currentStep`에 따라 정해집니다. */
  status?: StepperStatus;
};

export type StepperProps = Omit<ComponentPropsWithoutRef<'ol'>, 'children'> & {
  /** 단계 목록(순서대로). */
  steps: StepperStep[];
  /** 현재 단계의 순서(0부터 셈). 앞 단계는 완료, 뒤 단계는 예정으로 보입니다. @default 0 */
  currentStep?: number;
  /** 방향 — 가로(`horizontal`) · 세로(`vertical`). @default 'horizontal' */
  orientation?: StepperOrientation;
};

/** Duration of one connector fill — keep equal to the transition in Stepper.css. */
const FILL_MS = 300;

/**
 * What the stepper shows while it moves: steps before `done` are completed, `active` is current (-1 while a connector
 * fills), connectors before `filled` are filled. At rest all three equal the shown current step.
 */
type Shown = { done: number; active: number; filled: number };
const restAt = (step: number): Shown => ({ done: step, active: step, filled: step });

/**
 * Rules 09 "Stepper" (2026-10-29, reference HeroUI Stepper): the stepper moves one step at a time — moving forward the
 * step becomes completed, the next connector fills, then the next step becomes current; moving back the step becomes
 * upcoming, the connector empties, then the previous step becomes current. A jump of several steps plays them in order,
 * and a new `currentStep` during the motion continues from what is shown, so the last state always equals the props.
 * Screen readers get the real state at once (aria-current, "n단계, 완료"); with reduced motion the shown state follows
 * `currentStep` immediately.
 */
function useSteppedProgress(target: number): Shown {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState<Shown>(() => restAt(target));
  // Start the next phase while rendering (React's "adjust state when a prop changes" pattern): at rest and away from the
  // target, take one step; with reduced motion jump straight to the target.
  if (reduced) {
    if (shown.active !== target || shown.done !== target || shown.filled !== target) setShown(restAt(target));
  } else if (shown.active !== -1 && target !== shown.active) {
    const k = shown.active;
    setShown(target > k ? { done: k + 1, active: -1, filled: k + 1 } : { done: k, active: -1, filled: k - 1 });
  }
  // A phase ends when its connector has filled (or emptied).
  useEffect(() => {
    if (reduced || shown.active !== -1) return;
    const timer = setTimeout(() => setShown(restAt(shown.filled)), FILL_MS);
    return () => clearTimeout(timer);
  }, [shown, reduced]);
  return shown;
}

/** 여러 단계로 이루어진 과정의 현재 위치와 진행 상태를 표시합니다. 단계 이동 버튼으로 사용하지 않습니다. */
export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  { steps, currentStep = 0, orientation = 'horizontal', className, ...rest },
  ref,
) {
  const target = Math.max(-1, Math.min(currentStep, steps.length));
  const shown = useSteppedProgress(target);
  const statusOf = (step: StepperStep, index: number): StepperStatus =>
    step.status ?? (index < currentStep ? 'completed' : index === currentStep ? 'current' : 'upcoming');
  const shownStatusOf = (step: StepperStep, index: number): StepperStatus =>
    step.status ?? (index < shown.done ? 'completed' : index === shown.active ? 'current' : 'upcoming');
  // A step with its own status (locked · error) never shows a filled connector after it, as before.
  const filledAfter = (step: StepperStep, index: number) => (step.status ? step.status === 'completed' : index < shown.filled);
  return (
    <ol {...rest} ref={ref} className={cx('ds-stepper', className)} data-orientation={orientation}>
      {steps.map((step, index) => {
        const status = statusOf(step, index);
        return (
          <li key={index} className="ds-stepper__step" aria-current={status === 'current' ? 'step' : undefined}>
            <StepperIndicator
              status={status}
              displayStatus={shownStatusOf(step, index)}
              step={index + 1}
              label={step.label}
              description={step.description}
              orientation={orientation}
            />
            {index < steps.length - 1 && <StepperConnector orientation={orientation} completed={filledAfter(step, index)} />}
          </li>
        );
      })}
    </ol>
  );
});
