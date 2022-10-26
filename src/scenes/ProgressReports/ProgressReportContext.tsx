import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { ChildrenProp } from '~/common';
import { makeQueryHandler, NumberParam, withDefault } from '~/hooks';
import { ProgressReportFragment } from './Detail/ProgressReportDetail.graphql';

interface InitialProgressReportContextInterface {
  setProgressReportStep: (step: number) => void;
  nextProgressReportStep: () => void;
  previousProgressReportStep: () => void;
  setCurrentProgressReport: (report: ProgressReportFragment | null) => void;
  step: number;
  currentReport: ProgressReportFragment | null;
}

const initialProgressReportContext: InitialProgressReportContextInterface = {
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

  step: 0,
  currentReport: null,
};

const ProgressReportContext =
  createContext<InitialProgressReportContextInterface>(
    initialProgressReportContext
  );

const useStepState = makeQueryHandler({
  step: withDefault(NumberParam, 0),
});

export const ProgressReportContextProvider = ({ children }: ChildrenProp) => {
  const [{ step }, setStepState] = useStepState();

  const [currentReport, setReport] = useState<ProgressReportFragment | null>(
    null
  );

  const setStep = useCallback(
    (step: number) => {
      setStepState({ step });
    },
    [setStepState]
  );

  const setCurrentReport = useCallback(
    (report: ProgressReportFragment | null) => {
      setReport(report);
      setStep(initialProgressReportContext.step);
    },
    [setReport, setStep]
  );

  const nextProgressReportStep = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands -- linter is confused
    setStep(step + 1);
  }, [setStep, step]);

  const previousProgressReportStep = useCallback(() => {
    setStep(Math.max(step - 1, 0));
  }, [setStep, step]);

  const value = useMemo(
    () => ({
      setProgressReportStep: setStep,
      step,
      nextProgressReportStep,
      previousProgressReportStep,
      currentReport,
      setCurrentProgressReport: setCurrentReport,
    }),
    [
      setStep,
      step,
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
