import { useApolloClient } from '@apollo/client';
import * as React from 'react';
import { createContext, FC, useCallback, useContext, useMemo } from 'react';
import { Entity } from '../../api';
import { ChangesetDiffFragment } from '../../api/fragments/changeset.generated';
import { mapFromList } from '../../util';

export type DiffMode = 'added' | 'removed' | 'changed';
type DetermineDiffModeFn = (
  obj: unknown
) => readonly [
  mode: DiffMode | undefined,
  current: Entity | undefined,
  previous: Entity | undefined
];

export const ChangesetDiffContext = createContext<DetermineDiffModeFn>(() => [
  undefined,
  undefined,
  undefined,
]);

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

  const determineMode: DetermineDiffModeFn = useCallback(
    (obj) => {
      if (!obj) {
        return [undefined, undefined, undefined] as const;
      }
      const id = apollo.cache.identify(obj as any);
      if (!id) {
        return [undefined, undefined, undefined] as const;
      }
      if (id in value.added) {
        return ['added', value.added[id], undefined] as const;
      }
      if (id in value.added) {
        return ['removed', value.removed[id], undefined] as const;
      }
      if (id in value.changed) {
        const changed = value.changed[id]!;
        return ['changed', changed.updated, changed.previous] as const;
      }
      return [undefined, undefined, undefined] as const;
    },
    [apollo, value]
  );

  return (
    <ChangesetDiffContext.Provider value={determineMode}>
      {props.children}
    </ChangesetDiffContext.Provider>
  );
};

export const useDetermineDiffMode = () => useContext(ChangesetDiffContext);
export const useDiffMode: DetermineDiffModeFn = (obj) =>
  useContext(ChangesetDiffContext)(obj);
