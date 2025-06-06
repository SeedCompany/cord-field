import { useLocalStorageState } from 'ahooks';
import { noop } from 'lodash';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ChildrenProp } from '~/common';
import { SetHook, useSet } from '~/hooks';

const initialCommentsBarContext = {
  toggleCommentsBar: noop as (state?: boolean) => void,
  isCommentsBarOpen: false,
  expandedThreads: {} as unknown as SetHook<string>,
  resourceId: undefined as string | undefined,
  setResourceId: noop as (resourceId: string | undefined) => void,
};

export const CommentsContext = createContext(initialCommentsBarContext);

export const CommentsProvider = ({ children }: ChildrenProp) => {
  const [isCommentsBarOpen = false, setCommentsBarOpen] =
    useLocalStorageState<boolean>('show-comments', { defaultValue: false });

  const [resourceId, setResourceId] = useState<string | undefined>(undefined);

  const expandedThreads = useSet<string>();

  const toggleCommentsBar = useCallback(
    (state?: boolean) => {
      setCommentsBarOpen((prev) => state ?? !prev);
    },
    [setCommentsBarOpen]
  );

  const context = useMemo(
    () => ({
      toggleCommentsBar,
      isCommentsBarOpen,
      expandedThreads,
      resourceId,
      setResourceId,
    }),
    [
      toggleCommentsBar,
      isCommentsBarOpen,
      expandedThreads,
      resourceId,
      setResourceId,
    ]
  );

  return (
    <CommentsContext.Provider value={context}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useCommentsContext = () => useContext(CommentsContext);

export const useComments = (resourceId: string | null | undefined) => {
  const { setResourceId } = useCommentsContext();
  useEffect(() => {
    setResourceId(resourceId || undefined);
    return () => setResourceId(undefined);
  }, [resourceId, setResourceId]);
};
