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

export const stepNames = [
  'team-highlight',
  'community-story',
  'progress',
  'explain-progress',
  'submit-report',
];

const steps = {
  'Narrative Report': ['Team highlight', 'Community Story'],
  'Project Management': ['Progress', 'Explanation of Progress'],
  'Final Details': ['Submit Report'],
};
const flatSteps = Object.values(steps).flat();

interface ProgressReportContext {
  setProgressReportStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;

  step: number;
  steps: typeof steps;
  flatSteps: typeof flatSteps;
}

const ProgressReportContext = createContext<ProgressReportContext | null>(null);

const useStepState = makeQueryHandler({
  step: StringParam,
});

export const ProgressReportContextProvider = ({ children }: ChildrenProp) => {
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
      steps,
      flatSteps,
    }),
    [step, setStep, nextStep, previousStep]
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
