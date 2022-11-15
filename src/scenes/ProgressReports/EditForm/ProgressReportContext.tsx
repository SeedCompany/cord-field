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
  // ToDo: add this back when we have time to work on additional notes
  // 'additional-notes',
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

  step: 0,
  report: null as ProgressReportEditFragment | null,
};

const ProgressReportContext = createContext<
  typeof initialProgressReportContext
>(initialProgressReportContext);

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
      report,
    }),
    [step, setStep, nextProgressReportStep, previousProgressReportStep, report]
  );

  useEffect(() => {
    if (urlStep) {
      if (stepNames.includes(urlStep)) {
        setStep(stepNames.indexOf(urlStep));
      } else {
        setStep(initialProgressReportContext.step);
      }
    }
  }, [setStep, urlStep]);

  return (
    <ProgressReportContext.Provider value={value}>
      {children}
    </ProgressReportContext.Provider>
  );
};

export const useProgressReportContext = () => useContext(ProgressReportContext);
