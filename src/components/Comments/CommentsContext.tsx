import { useLocalStorageState, useSet } from 'ahooks';
import { noop } from 'lodash';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { ChildrenProp } from '~/common';

type ExpandedThreads = ReturnType<typeof useSet<string>>[1] & {
  has: (threadId: string) => boolean;
  toggle: (threadId: string, next?: boolean) => void;
};

const initialCommentsBarContext = {
  toggleCommentsBar: noop,
  isCommentsBarOpen: false,
  expandedThreads: {} as unknown as ExpandedThreads,
  resourceCommentsTotal: 0,
  setResourceCommentsTotal: noop,
};

export const CommentsContext = createContext(initialCommentsBarContext);

export const CommentsProvider = ({ children }: ChildrenProp) => {
  const [isCommentsBarOpen = false, setCommentsBarOpen] =
    useLocalStorageState<boolean>('show-comments', { defaultValue: false });

  const [resourceCommentsTotal, setResourceCommentsTotal] = useState(0);

  const [currentExpandedThreads, setExpandedThreads] = useSet<string>();
  const expandedThreads = useMemo(
    (): ExpandedThreads => ({
      ...setExpandedThreads,
      has: currentExpandedThreads.has.bind(currentExpandedThreads),
      toggle: (threadId: string, next?: boolean) => {
        next = next ?? !currentExpandedThreads.has(threadId);
        setExpandedThreads[next ? 'add' : 'remove'](threadId);
      },
    }),
    [currentExpandedThreads, setExpandedThreads]
  );

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
      resourceCommentsTotal,
      setResourceCommentsTotal,
    }),
    [
      toggleCommentsBar,
      isCommentsBarOpen,
      expandedThreads,
      resourceCommentsTotal,
    ]
  );

  return (
    <CommentsContext.Provider value={context}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useCommentsContext = () => useContext(CommentsContext);
