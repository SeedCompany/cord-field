import { useApolloClient } from '@apollo/client';
import * as React from 'react';
import { createContext, FC, useCallback, useContext, useMemo } from 'react';
import { Entity } from '../../api';
import {
  ChangesetDiffFragment,
  ChangesetDiffItemFragment,
} from '../../api/fragments/changeset.generated';
import { mapFromList } from '../../util';

export type DiffMode = 'added' | 'removed' | 'changed';
export type EntityFromChangesetDiff<T extends Entity> = Extract<
  ChangesetDiffItemFragment,
  {
    __typename?: T['__typename'];
  }
>;
type DetermineChangesetDiffItemFn = <
  T extends Entity,
  DiffItem extends EntityFromChangesetDiff<T>
>(
  obj: T | null | undefined
) =>
  | { mode: undefined; current: undefined; previous: undefined }
  | { mode: 'added' | 'removed'; current: DiffItem; previous: undefined }
  | { mode: 'changed'; current: DiffItem; previous: DiffItem };

const defaultValue = {
  mode: undefined,
  current: undefined,
  previous: undefined,
};
export const ChangesetDiffContext = createContext<DetermineChangesetDiffItemFn>(
  () => defaultValue
);

export const ChangesetDiffProvider: FC<{
  value: ChangesetDiffFragment | null | undefined;
}> = (props) => {
  const apollo = useApolloClient();
  const value = useMemo(() => {
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

  const determineMode = useCallback<DetermineChangesetDiffItemFn>(
    (obj: any) => {
      if (!obj) {
        return defaultValue;
      }
      const id = apollo.cache.identify(obj);
      if (!id) {
        return defaultValue;
      }
      if (id in value.added) {
        return {
          mode: 'added',
          current: value.added[id]!,
          previous: undefined,
        };
      }
      if (id in value.added) {
        return {
          mode: 'removed',
          current: value.removed[id]!,
          previous: undefined,
        };
      }
      if (id in value.changed) {
        const changed = value.changed[id]!;
        return {
          mode: 'changed',
          current: changed.updated as any,
          previous: changed.previous as any,
        };
      }
      return defaultValue;
    },
    [apollo, value]
  );

  return (
    <ChangesetDiffContext.Provider value={determineMode}>
      {props.children}
    </ChangesetDiffContext.Provider>
  );
};

export const useDetermineChangesetDiffItem = () =>
  useContext(ChangesetDiffContext);
export const useChangesetDiffItem: DetermineChangesetDiffItemFn = (obj) =>
  useContext(ChangesetDiffContext)(obj);
