import { expect, waitFor } from 'storybook/test';

/**
 * Story-test helper (not part of the package API). Rules 09 open / close motion (Select, DatePicker, Breadcrumb, chip
 * filter) and the selection / stepper motion run for up to a few hundred ms; geometry checks wait until no finite
 * animation or transition is running, i.e. they measure the resting state the design defines. Repeating animations
 * (Loading, Skeleton) are ignored.
 */
export async function motionSettled() {
  await waitFor(
    () =>
      expect(
        document
          .getAnimations()
          .filter((a) => a.playState === 'running' && Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity)).length,
      ).toBe(0),
    { timeout: 3000 },
  );
}
