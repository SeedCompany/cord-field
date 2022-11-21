import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ChildrenProp } from '~/common';
import { makeQueryHandler, StringParam } from '~/hooks';
import { ProgressReportEditFragment } from './ProgressReportEdit.graphql';

export const stepNames = [
  'team-highlight',
  'community-story',
  'progress',
  'submit-report',
];

interface ProgressReportContext {
  setProgressReportStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;

  step: number;
  report: ProgressReportEditFragment;
}

const ProgressReportContext = createContext<ProgressReportContext | null>(null);

const useStepState = makeQueryHandler({
  step: StringParam,
});

export const ProgressReportContextProvider = ({
  children,
  report,
}: { report: ProgressReportEditFragment } & ChildrenProp) => {
  const [{ step: urlStep }, setStepState] = useStepState();

  const stepIndex = stepNames.indexOf(urlStep);
  const [step, setIndexStep] = useState(stepIndex > -1 ? stepIndex : 0);

  const setStep = useCallback(
    (step: number) => {
      setIndexStep(step);
      setStepState({ step: stepNames[step] });
    },
    [setStepState]
  );

  const nextStep = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands -- linter is confused
    setStep(Math.min(step + 1, stepNames.length - 1));
  }, [setStep, step]);

  const previousStep = useCallback(() => {
    setStep(Math.max(step - 1, 0));
  }, [setStep, step]);

  const value = useMemo(
    () => ({
      step,
      setProgressReportStep: setStep,
      nextStep,
      previousStep,
      report,
    }),
    [step, setStep, nextStep, previousStep, report]
  );

  useEffect(() => {
    if (urlStep) {
      if (stepNames.includes(urlStep)) {
        setStep(stepNames.indexOf(urlStep));
      } else {
        setStep(0);
      }
    }
  }, [setStep, urlStep]);

  return (
    <ProgressReportContext.Provider value={value}>
      {children}
    </ProgressReportContext.Provider>
  );
};

export const useProgressReportContext = () => {
  const context = useContext(ProgressReportContext);
  if (!context) {
    throw new Error(
      'useProgressReportContext must be used within a ProgressReportContextProvider'
    );
  }
  return context;
};
