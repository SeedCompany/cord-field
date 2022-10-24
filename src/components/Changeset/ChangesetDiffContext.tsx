import { useApolloClient } from '@apollo/client';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { Entity } from '~/api';
import { ChildrenProp, IdFragment, mapFromList, Nullable } from '~/common';
import { ChangesetDiffItemFragment as DiffItem } from '~/common/fragments';
import { ChangedUnderProjectFragment as ChangedUnderProject } from './ProjectChangesetDiff.graphql';

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
  obj: Nullable<T>
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
    value: ChangedUnderProject | null | undefined;
  } & ChildrenProp
) => {
  const apollo = useApolloClient();
  const diff = defaultProcessedDiff;
  const diff2 = useMemo(() => {
    const toCacheId = (obj: any) => {
      const id = apollo.cache.identify(obj);
      return id ? ([id, obj] as const) : null;
    };
    return {
      added: mapFromList(props.value?.added ?? [], toCacheId),
      removed: mapFromList(props.value?.removed ?? [], toCacheId),
      changed: mapFromList(props.value?.changed ?? [], (obj) => {
        const pair = toCacheId(obj.updated);
        return pair ? [pair[0], obj] : null;
      }),
    };
  }, [apollo, props.value]);

  console.log(diff2);

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
