import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { ChildrenProp } from '~/common';
import { ProgressReportFragment } from './Detail/ProgressReportDetail.graphql';

interface InitialProgressReportContextInterface {
  toggleProgressReportDrawer: (state?: boolean) => void;
  setProgressReportStep: (step: number) => void;
  nextProgressReportStep: () => void;
  previousProgressReportStep: () => void;
  setCurrentProgressReport: (report: ProgressReportFragment | null) => void;
  progressReportStep: number;
  progressReportDrawer: boolean;
  currentReport: ProgressReportFragment | null;
}

const initialProgressReportContext: InitialProgressReportContextInterface = {
  // eslint-disable-next-line @seedcompany/no-unused-vars
  toggleProgressReportDrawer: (state?: boolean) => {
    return;
  },
  // eslint-disable-next-line @seedcompany/no-unused-vars
  setProgressReportStep: (step: number) => {
    return;
  },

  nextProgressReportStep: () => {
    return;
  },

  previousProgressReportStep: () => {
    return;
  },

  // eslint-disable-next-line @seedcompany/no-unused-vars
  setCurrentProgressReport(report: ProgressReportFragment | null) {
    return;
  },

  progressReportStep: 0,
  progressReportDrawer: false,
  currentReport: null,
};

const ProgressReportContext =
  createContext<InitialProgressReportContextInterface>(
    initialProgressReportContext
  );

export const ProgressReportContextProvider = ({ children }: ChildrenProp) => {
  const [progressReportDrawer, setProgressReportDrawer] = useState(false);
  const [progressReportStep, setProgressReportStep] = useState(0);
  const [currentReport, setCurrentReport] =
    useState<ProgressReportFragment | null>(null);

  const toggleProgressReportDrawer = useCallback(
    (state?: boolean) => {
      setProgressReportDrawer(state ?? !progressReportDrawer);
    },
    [progressReportDrawer]
  );

  const nextProgressReportStep = useCallback(() => {
    setProgressReportStep((prev) => prev + 1);
  }, []);

  const previousProgressReportStep = useCallback(() => {
    setProgressReportStep((prev) => (prev - 1 < 0 ? 0 : prev - 1));
  }, []);

  const value = useMemo(
    () => ({
      toggleProgressReportDrawer,
      setProgressReportStep,
      progressReportStep,
      progressReportDrawer,
      nextProgressReportStep,
      previousProgressReportStep,
      currentReport,
      setCurrentProgressReport: setCurrentReport,
    }),
    [
      toggleProgressReportDrawer,
      setProgressReportStep,
      progressReportStep,
      progressReportDrawer,
      nextProgressReportStep,
      previousProgressReportStep,
      currentReport,
      setCurrentReport,
    ]
  );

  return (
    <ProgressReportContext.Provider value={value}>
      {children}
    </ProgressReportContext.Provider>
  );
};

export const useProgressReportContext = () => useContext(ProgressReportContext);
