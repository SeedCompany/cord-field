import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { ChildrenProp } from '~/common';
import {
  BooleanParam,
  makeQueryHandler,
  NumberParam,
  withDefault,
} from '~/hooks';
import { ProgressReportFragment } from './Detail/ProgressReportDetail.graphql';

interface InitialProgressReportContextInterface {
  toggleProgressReportDrawer: (state?: boolean) => void;
  setProgressReportStep: (step: number) => void;
  nextProgressReportStep: () => void;
  previousProgressReportStep: () => void;
  setCurrentProgressReport: (report: ProgressReportFragment | null) => void;
  step: number;
  drawerOpen: boolean;
  currentReport: ProgressReportFragment | null;
}

interface QueryParamsInterface {
  edit: boolean;
  step: number;
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

  step: 0,
  drawerOpen: false,
  currentReport: null,
};

const ProgressReportContext =
  createContext<InitialProgressReportContextInterface>(
    initialProgressReportContext
  );

export const ProgressReportContextProvider = ({ children }: ChildrenProp) => {
  const useSearchParams = makeQueryHandler({
    edit: withDefault(BooleanParam(), false),
    step: withDefault(NumberParam, 0),
  });
  const [{ edit, step }, setParams] = useSearchParams() as [
    QueryParamsInterface,
    (data: any) => void
  ];

  const [currentReport, setReport] = useState<ProgressReportFragment | null>(
    null
  );

  const setStep = useCallback(
    (step: number) => {
      setParams({ step, edit });
    },
    [edit, setParams]
  );

  const setCurrentReport = useCallback(
    (report: ProgressReportFragment | null) => {
      setReport(report);
      setStep(initialProgressReportContext.step);
    },
    [setReport, setStep]
  );

  const setEdit = useCallback(
    (edit: boolean) => {
      setParams({ edit, step });
    },
    [setParams, step]
  );

  const toggleProgressReportDrawer = useCallback(
    (state?: boolean) => {
      setEdit(state ?? !edit);
    },
    [edit, setEdit]
  );

  const nextProgressReportStep = useCallback(() => {
    setStep(step + 1);
  }, [setStep, step]);

  const previousProgressReportStep = useCallback(() => {
    setStep(step - 1 < 0 ? 0 : step - 1);
  }, [setStep, step]);

  const value = useMemo(
    () => ({
      toggleProgressReportDrawer,
      setProgressReportStep: setStep,
      step,
      drawerOpen: edit,
      nextProgressReportStep,
      previousProgressReportStep,
      currentReport,
      setCurrentProgressReport: setCurrentReport,
    }),
    [
      toggleProgressReportDrawer,
      setStep,
      step,
      edit,
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
