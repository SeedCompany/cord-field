import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { ChildrenProp } from '~/common';
import { makeQueryHandler, StringParam } from '~/hooks';
import { ProgressReportEditFragment } from './Detail/ProgressReportDrawer/ProgressReportDrawer.graphql';

export const stepNames = [
  'team-highlight',
  'community-story',
  'progress',
  'additional-notes',
];

const initialProgressReportContext = {
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
  setCurrentProgressReport: (report: ProgressReportEditFragment | null) => {
    return;
  },

  step: 0,
  currentReport: null as ProgressReportEditFragment | null,
};

const ProgressReportContext = createContext<
  typeof initialProgressReportContext
>(initialProgressReportContext);

const useStepState = makeQueryHandler({
  step: StringParam,
});

export const ProgressReportContextProvider = ({ children }: ChildrenProp) => {
  const [{ step: urlStep }, setStepState] = useStepState();

  const stepIndex = stepNames.indexOf(urlStep);
  const [step, setIndexStep] = useState(stepIndex > -1 ? stepIndex : 0);

  const [currentReport, setReport] =
    useState<ProgressReportEditFragment | null>(null);

  const setStep = useCallback(
    (step: number) => {
      setIndexStep(step);
      setStepState({ step: stepNames[step] });
    },
    [setStepState]
  );

  const setCurrentReport = useCallback(
    (report: ProgressReportEditFragment | null) => {
      if (!report) {
        setStep(initialProgressReportContext.step);
        return;
      } else if (urlStep) {
        if (stepNames.includes(urlStep)) {
          setStep(stepNames.indexOf(urlStep));
        } else {
          setStep(initialProgressReportContext.step);
        }
      }
      setReport(report);
    },
    [setStep, urlStep]
  );

  const nextProgressReportStep = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands -- linter is confused
    setStep(Math.min(step + 1, stepNames.length - 1));
  }, [setStep, step]);

  const previousProgressReportStep = useCallback(() => {
    setStep(Math.max(step - 1, 0));
  }, [setStep, step]);

  const value = useMemo(
    () => ({
      step,
      setProgressReportStep: setStep,
      nextProgressReportStep,
      previousProgressReportStep,
      currentReport,
      setCurrentProgressReport: setCurrentReport,
    }),
    [
      step,
      setStep,
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
