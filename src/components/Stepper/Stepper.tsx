import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { CheckIcon, ExclamationMarkIcon } from '../../icons';
import { cx } from '../../utils/cx';
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
};

/**
 * 단계 하나를 나타내는 원과 글자입니다. 원 안에는 번호가 보이고, 완료이면 체크 아이콘, 오류이면 경고 아이콘이 보입니다.
 * `Stepper`가 안에서 그립니다.
 * @internal Rendered by `Stepper` — use that (docs/public-api.md).
 */
export const StepperIndicator = forwardRef<HTMLDivElement, StepperIndicatorProps>(function StepperIndicator(
  { status = 'upcoming', step, label, description, orientation = 'horizontal', className, ...rest },
  ref,
) {
  const hasLabel = label != null && label !== false;
  const hasDescription = description != null && description !== false;
  return (
    <div {...rest} ref={ref} className={cx('ds-stepper-indicator', className)} data-status={status} data-orientation={orientation}>
      <span className="ds-stepper-indicator__circle" aria-hidden="true">
        {status === 'completed' ? (
          <CheckIcon className="ds-stepper-indicator__icon" />
        ) : status === 'error' ? (
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
      <svg className="ds-stepper-connector__line" focusable="false">
        <rect />
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

/** 여러 단계로 이루어진 과정의 현재 위치와 진행 상태를 표시합니다. 단계 이동 버튼으로 사용하지 않습니다. */
export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  { steps, currentStep = 0, orientation = 'horizontal', className, ...rest },
  ref,
) {
  const statusOf = (step: StepperStep, index: number): StepperStatus =>
    step.status ?? (index < currentStep ? 'completed' : index === currentStep ? 'current' : 'upcoming');
  return (
    <ol {...rest} ref={ref} className={cx('ds-stepper', className)} data-orientation={orientation}>
      {steps.map((step, index) => {
        const status = statusOf(step, index);
        return (
          <li key={index} className="ds-stepper__step" aria-current={status === 'current' ? 'step' : undefined}>
            <StepperIndicator status={status} step={index + 1} label={step.label} description={step.description} orientation={orientation} />
            {index < steps.length - 1 && <StepperConnector orientation={orientation} completed={status === 'completed'} />}
          </li>
        );
      })}
    </ol>
  );
});
