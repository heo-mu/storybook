import { forwardRef, type SVGProps } from 'react';

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'ref'> & {
  /** Rendered width and height. Inside a component's icon slot the slot size wins. @default 16 */
  size?: number | string;
};

/**
 * Icons exported from the Figma icon instances (16×16 grid unless `viewBox` says otherwise; larger
 * Figma sizes are the same vectors scaled). They use `currentColor`, so the surrounding component's
 * icon colour token applies.
 */
export function createIcon(displayName: string, path: string, viewBox = 16) {
  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon({ size = viewBox, ...props }, ref) {
    return (
      <svg ref={ref} width={size} height={size} viewBox={`0 0 ${viewBox} ${viewBox}`} fill="none" aria-hidden="true" focusable="false" {...props}>
        <path d={path} fill="currentColor" />
      </svg>
    );
  });
  Icon.displayName = displayName;
  return Icon;
}
