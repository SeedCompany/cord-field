import { ApolloCache, MutationUpdaterFunction, Unmasked } from '@apollo/client';
import { DateTime, Interval } from 'luxon';
import { invalidateProps } from '~/api';
import { Project as ProjectShape } from '~/api/schema.graphql';
import { CalendarDate, SecuredProp } from '~/common';
import {
  PartnershipToCheckBudgetChangeFragment,
  ProjectsBudgetForPartnershipChangeFragmentDoc as ProjectsBudget,
} from './ProjectsBudget.graphql';

type Project = Pick<ProjectShape, 'id'>;
type Partnership = PartnershipToCheckBudgetChangeFragment | undefined;

/**
 * Funding partnerships affect budget records.
 * Invalidate budget records when they are changed.
 */
export const invalidateBudgetRecords =
  <R>(
    project: Project,
    previousOrFn: Partnership | ((res: Unmasked<R>) => Partnership),
    updatedOrFn: Partnership | ((res: Unmasked<R>) => Partnership)
  ): MutationUpdaterFunction<R, unknown, unknown, ApolloCache<unknown>> =>
  (cache: ApolloCache<unknown>, res) => {
    const previous: Partnership =
      typeof previousOrFn === 'function'
        ? res.data
          ? previousOrFn(res.data)
          : undefined
        : previousOrFn;
    const updated: Partnership =
      typeof updatedOrFn === 'function'
        ? res.data
          ? updatedOrFn(res.data)
          : undefined
        : updatedOrFn;

    const change = determineChange(previous, updated);
    if (change == null) {
      console.log('No budget change needed for partnership change');
      return;
    }
    if (change) {
      console.log('Partnership changed budget in a destructive way');
    } else {
      console.log('Partnership changed budget in a non-destructive way');
    }
    doInvalidate(cache, project, change);
  };

/**
 * Returns boolean for whether the change is destructive or not, or null for no change.
 */
const determineChange = (previous: Partnership, updated: Partnership) => {
  if (previous?.types.canRead === false || updated?.types.canRead === false) {
    // If cannot read types, assume the worst
    return true;
  }
  const prevFunding = isFunding(previous);
  const nowFunding = isFunding(updated);

  if (!prevFunding && nowFunding) {
    // If adding a funding partnership, records are only added
    return false;
  }
  if (!nowFunding && prevFunding) {
    // If removing a funding partnership, records are removed
    return true;
  }
  if (!previous || !updated) {
    // partnership was added/removed but not in a way that affects records
    return null;
  }

  // check date range to determine change
  if (!previous.mouRange.canRead || !updated.mouRange.canRead) {
    // If cannot read times, assume the worst
    return true;
  }
  const prev = interval(previous.mouRange);
  const now = interval(updated.mouRange);

  if (!prev) {
    if (!now) {
      return null;
    } else {
      // partnership now has a range, records will be added
      return false;
    }
  }
  if (!now) {
    // partnership now doesn't have a range, records will be removed
    return true;
  }

  if (prev.equals(now)) {
    return null;
  }

  // If updated range is a subset of previous, then records could be removed.
  // Otherwise records could only be added.
  return prev.engulfs(now);
};

const isFunding = (partnership: Partnership) =>
  partnership?.types.value.includes('Funding');

const interval = (
  range: SecuredProp<{
    start?: CalendarDate | string | null;
    end?: CalendarDate | string | null;
  }>
) => {
  const s = dt(range.value?.start);
  const e = dt(range.value?.end);
  return s && e ? Interval.fromDateTimes(s, e) : null;
};

// values straight from update result don't go through type policy reads,
// thus they are not parsed to luxon objects.
const dt = (value: DateTime | string | null | undefined) =>
  !value ? null : typeof value === 'string' ? DateTime.fromISO(value) : value;

const doInvalidate = (
  cache: ApolloCache<unknown>,
  project: Project,
  destructive: boolean
) => {
  const cached = cache.readFragment({
    id: cache.identify(project),
    fragment: ProjectsBudget,
  });
  const budget = cached?.budget.value;
  if (!budget) {
    return;
  }

  invalidateProps(cache, budget, 'records', destructive ? 'total' : null);
};
