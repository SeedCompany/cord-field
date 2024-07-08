import { useCookieState } from 'ahooks';
import { noop } from 'lodash';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { ChildrenProp } from '~/common';

const initialCommentsBarContext = {
  toggleThreadComments: noop,
  toggleCommentsBar: noop,
  isCommentsBarOpen: false,
  expandedThreads: [] as string[],
  resourceCommentsTotal: 0,
  setResourceCommentsTotal: noop,
};

export const CommentsBarContext = createContext(initialCommentsBarContext);

CommentsBarContext.displayName = 'CommentsBarContext';

export const CommentsBarProvider = ({ children }: ChildrenProp) => {
  const [cookieCommentsBarOpen, setCookieCommentsBarOpen] = useCookieState(
    'show-comments',
    { defaultValue: 'false' }
  );
  const isCommentsBarOpen = cookieCommentsBarOpen === 'true';

  const [expandedThreads, setExpandedThreads] = useState<string[]>([]);
  const [resourceCommentsTotal, setResourceCommentsTotal] = useState(0);

  const toggleThreadComments = useCallback(
    (threadId: string, state?: boolean) => {
      if (state === undefined) {
        setExpandedThreads((prev) =>
          prev.includes(threadId)
            ? prev.filter((id) => id !== threadId)
            : [...prev, threadId]
        );
      } else {
        setExpandedThreads((prev) =>
          state ? [...prev, threadId] : prev.filter((id) => id !== threadId)
        );
      }
    },
    []
  );

  const toggleCommentsBar = useCallback(
    (state?: boolean) => {
      if (state === undefined) {
        setCookieCommentsBarOpen((prev) =>
          prev === 'true' ? 'false' : 'true'
        );
      } else {
        setCookieCommentsBarOpen(state ? 'true' : 'false');
      }
    },
    [setCookieCommentsBarOpen]
  );

  const context = useMemo(
    () => ({
      toggleThreadComments,
      toggleCommentsBar,
      isCommentsBarOpen,
      expandedThreads,
      resourceCommentsTotal,
      setResourceCommentsTotal,
    }),
    [
      toggleThreadComments,
      toggleCommentsBar,
      isCommentsBarOpen,
      expandedThreads,
      resourceCommentsTotal,
    ]
  );

  return (
    <CommentsBarContext.Provider value={context}>
      {children}
    </CommentsBarContext.Provider>
  );
};

export const useCommentsContext = () => useContext(CommentsBarContext);
