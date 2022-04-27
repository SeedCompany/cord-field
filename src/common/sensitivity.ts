import { orderBy } from 'lodash';
import { Sensitivity } from '~/api/schema';

export const highestSensitivity = (
  sensitivities: Sensitivity[],
  defaultLevel: Sensitivity
) => orderBy(sensitivities, (sens) => ranks[sens], 'desc')[0] ?? defaultLevel;

const ranks: Record<Sensitivity, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
};
