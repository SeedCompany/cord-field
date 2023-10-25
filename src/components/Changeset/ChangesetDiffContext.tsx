import { useApolloClient } from '@apollo/client';
import { mapKeys, Nil } from '@seedcompany/common';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { Entity } from '~/api';
import { ChildrenProp, IdFragment } from '~/common';
import {
  ChangesetDiffFragment as Diff,
  ChangesetDiffItemFragment as DiffItem,
} from '~/common/fragments';

export type DiffMode = 'added' | 'removed' | 'changed';
export type EntityFromChangesetDiff<T extends Entity> = Extract<
  DiffItem,
  {
    __typename?: T['__typename'];
  }
>;
type DetermineChangesetDiffItemFn = <
  T extends Entity,
  TDiffItem extends EntityFromChangesetDiff<T>
>(
  obj: T | Nil
) =>
  | { mode: undefined; current: undefined; previous: undefined }
  | { mode: 'added'; current: TDiffItem; previous: undefined }
  | { mode: 'removed'; current: TDiffItem; previous: undefined }
  | { mode: 'changed'; current: TDiffItem; previous: TDiffItem };

interface ProcessedDiff {
  added: Record<string, DiffItem>;
  removed: Record<string, DiffItem>;
  changed: Record<string, { previous: DiffItem; updated: DiffItem }>;
}

const defaultDeterminedDiffItem: ReturnType<DetermineChangesetDiffItemFn> = {
  mode: undefined,
  current: undefined,
  previous: undefined,
};
const defaultProcessedDiff: ProcessedDiff = {
  added: {},
  removed: {},
  changed: {},
};
export const ChangesetDiffContext = createContext({
  diff: defaultProcessedDiff,
  determineChangesetDiffItem: (() =>
    defaultDeterminedDiffItem) as DetermineChangesetDiffItemFn,
});

export const ChangesetDiffProvider = (
  props: {
    value: Diff | null | undefined;
  } & ChildrenProp
) => {
  const apollo = useApolloClient();
  const diff: ProcessedDiff = useMemo(
    () => ({
      added: mapKeys.fromList(
        props.value?.added ?? [],
        (obj, { SKIP }) => apollo.cache.identify(obj) ?? SKIP
      ).asRecord,
      removed: mapKeys.fromList(
        props.value?.removed ?? [],
        (obj, { SKIP }) => apollo.cache.identify(obj) ?? SKIP
      ).asRecord,
      changed: mapKeys.fromList(
        props.value?.changed ?? [],
        (obj, { SKIP }) => apollo.cache.identify(obj.updated) ?? SKIP
      ).asRecord,
    }),
    [apollo, props.value]
  );

  const determineChangesetDiffItem = useCallback(
    (obj: any) => {
      if (!obj) {
        return defaultDeterminedDiffItem;
      }
      const id = apollo.cache.identify(obj);
      if (!id) {
        return defaultDeterminedDiffItem;
      }
      if (id in diff.added) {
        return {
          mode: 'added',
          current: diff.added[id]!,
          previous: undefined,
        };
      }
      if (id in diff.removed) {
        return {
          mode: 'removed',
          current: diff.removed[id]!,
          previous: undefined,
        };
      }
      if (id in diff.changed) {
        const changed = diff.changed[id]!;
        return {
          mode: 'changed',
          current: changed.updated,
          previous: changed.previous,
        };
      }
      return defaultDeterminedDiffItem;
    },
    [apollo, diff]
  ) as DetermineChangesetDiffItemFn;

  const contextMemo = useMemo(
    () => ({
      diff,
      determineChangesetDiffItem,
    }),
    [diff, determineChangesetDiffItem]
  );

  return (
    <ChangesetDiffContext.Provider value={contextMemo}>
      {props.children}
    </ChangesetDiffContext.Provider>
  );
};

export const useDetermineChangesetDiffItem = () =>
  useContext(ChangesetDiffContext).determineChangesetDiffItem;
export const useChangesetDiffItem: DetermineChangesetDiffItemFn = (obj) =>
  useContext(ChangesetDiffContext).determineChangesetDiffItem(obj);

export type ChangesetItemFilterFn<R extends DiffItem> = (
  obj: IdFragment
) => obj is R;

export const useDeletedItemsOfChangeset = <R extends DiffItem>(
  filter?: ChangesetItemFilterFn<R>
): readonly R[] => {
  const { diff } = useContext(ChangesetDiffContext);
  return useMemo(() => {
    if (!filter) {
      return [];
    }
    return Object.values(diff.removed).filter(filter);
  }, [diff.removed, filter]);
};
