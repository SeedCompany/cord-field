import { useCookieState } from 'ahooks';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { ChildrenProp } from '~/common';

interface InitialCommentsBarContextInterface {
  toggleCommentsBar: (state?: boolean) => void;
  toggleThreadComments: (threadId: string) => void;
  expandedThreads: string[];
  isCommentsBarOpen: boolean;
}

const initialCommentsBarContext: InitialCommentsBarContextInterface = {
  // eslint-disable-next-line @seedcompany/no-unused-vars
  toggleThreadComments: (threadId: string) => {
    return;
  },

  // eslint-disable-next-line @seedcompany/no-unused-vars
  toggleCommentsBar: (state?: boolean) => {
    return;
  },

  expandedThreads: [],

  isCommentsBarOpen: false,
};

export const CommentsBarContext =
  createContext<InitialCommentsBarContextInterface>(initialCommentsBarContext);

CommentsBarContext.displayName = 'CommentsBarContext';

export const CommentsBarProvider = ({ children }: ChildrenProp) => {
  const [cookieCommentsBarOpen, setCookieCommentsBarOpen] = useCookieState(
    'commentsBarOpen',
    { defaultValue: 'false' }
  );

  const [isCommentsBarOpen, setCommentsBarOpen] = useState(
    cookieCommentsBarOpen === 'true'
  );

  const [expandedThreads, setExpandedThreads] = useState<string[]>([]);

  const toggleThreadComments = useCallback((threadId: string) => {
    setExpandedThreads((prev) =>
      prev.includes(threadId)
        ? prev.filter((id) => id !== threadId)
        : [...prev, threadId]
    );
  }, []);

  const toggleCommentsBar = useCallback(
    (state?: boolean) => {
      if (state === undefined) {
        setCommentsBarOpen((prev) => !prev);
        setCookieCommentsBarOpen((prev) =>
          prev === 'true' ? 'false' : 'true'
        );
      } else {
        setCommentsBarOpen(state);
        setCookieCommentsBarOpen(state ? 'true' : 'false');
      }
    },
    [setCommentsBarOpen, setCookieCommentsBarOpen]
  );

  const context = useMemo(
    () => ({
      toggleThreadComments,
      toggleCommentsBar,
      isCommentsBarOpen,
      expandedThreads,
    }),
    [
      toggleThreadComments,
      toggleCommentsBar,
      isCommentsBarOpen,
      expandedThreads,
    ]
  );

  return (
    <CommentsBarContext.Provider value={context}>
      {children}
    </CommentsBarContext.Provider>
  );
};

export const useCommentsContext = () => useContext(CommentsBarContext);
