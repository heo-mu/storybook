import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { CheckCircleIcon, WarningCircleIcon } from '../../icons';
import { cx } from '../../utils/cx';
import type { StepperOrientation, StepperStatus } from './Stepper.options';

/** Text read by screen readers for states that are shown only by colour or icon. */
const STATUS_TEXT: Partial<Record<StepperStatus, string>> = { completed: '완료', error: '오류', locked: '잠김' };

export type StepperIndicatorProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** Figma "Variant". @default 'upcoming' */
  status?: StepperStatus;
  /** Step number in the circle (Upcoming · Current · Locked). */
  step: number;
  /** Figma "Label Text" ("Label" on). */
  label?: ReactNode;
  /** Figma "Sub-Label Text" ("Sub-Label" on). */
  description?: ReactNode;
  /** Figma set: stepper_indicator_horizontal (text under the circle) or _vertical (text beside it). @default 'horizontal' */
  orientation?: StepperOrientation;
};

/**
 * Figma component sets `stepper_indicator_horizontal` (179:1621) and `stepper_indicator_vertical` (203:3708):
 * 20px circle (number, CheckCircle when completed, WarningCircle on error) with label and sub label. The root is as
 * wide (horizontal) or as tall (vertical) as the circle; the text overflows it centred, as in Figma.
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
          <CheckCircleIcon className="ds-stepper-indicator__icon" />
        ) : status === 'error' ? (
          <WarningCircleIcon className="ds-stepper-indicator__icon" />
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
  /** Figma "State" Completed. @default false */
  completed?: boolean;
  /** Figma "Type". @default 'horizontal' */
  orientation?: StepperOrientation;
};

/**
 * Figma component sets `stepper_connector_horizontal` (179:1614) and `stepper_connector_vertical` (203:4253).
 * The line is an SVG rect so it keeps the Figma geometry (1px centred on the band, i.e. on a half pixel).
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
  /** Step title (Figma "Label Text"). */
  label?: ReactNode;
  /** Text under the title (Figma "Sub-Label Text"). */
  description?: ReactNode;
  /** Overrides the status derived from `currentStep` — e.g. 'locked' or 'error'. */
  status?: StepperStatus;
};

export type StepperProps = Omit<ComponentPropsWithoutRef<'ol'>, 'children'> & {
  /** The steps, in order (Figma "Steps": 3 – 5). */
  steps: StepperStep[];
  /** Index of the current step (0-based). Earlier steps are completed, later ones upcoming. @default 0 */
  currentStep?: number;
  /** Figma "Type". @default 'horizontal' */
  orientation?: StepperOrientation;
};

/**
 * Figma component sets `stepper_horizontal` (179:2043) and `stepper_vertical` (203:3949): indicators joined by
 * connectors; a connector is Completed after a completed step. Progress display only (not interactive).
 */
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
