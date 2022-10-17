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
  toggleCommentsBar: () => void;
  toggleThreadComments: (threadId: string) => void;
  expandedThreads: string[];
  isCommentsBarOpen: boolean;
}

const initialCommentsBarContext: InitialCommentsBarContextInterface = {
  // eslint-disable-next-line @seedcompany/no-unused-vars
  toggleThreadComments: (threadId: string) => {
    return;
  },

  toggleCommentsBar: () => {
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
    console.log('toggleThreadComments', threadId);
    setExpandedThreads((prev) =>
      prev.includes(threadId)
        ? prev.filter((id) => id !== threadId)
        : [...prev, threadId]
    );
  }, []);

  const toggleCommentsBar = useCallback(() => {
    setCommentsBarOpen((prev) => !prev);
    setCookieCommentsBarOpen((prev) => (prev === 'true' ? 'false' : 'true'));
  }, [setCommentsBarOpen, setCookieCommentsBarOpen]);

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
