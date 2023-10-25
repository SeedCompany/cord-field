import { sortBy } from '@seedcompany/common';
import { Sensitivity } from '~/api/schema.graphql';

export const highestSensitivity = (
  sensitivities: Sensitivity[],
  defaultLevel: Sensitivity
) => sortBy(sensitivities, (sens) => ranks[sens]).at(-1) ?? defaultLevel;

const ranks: Record<Sensitivity, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
};
