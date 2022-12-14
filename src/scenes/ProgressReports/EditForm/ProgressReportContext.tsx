import { kebabCase } from 'lodash';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { ChildrenProp } from '~/common';
import { makeQueryHandler, StringParam } from '~/hooks';
import { Steps } from './Steps';

const flatSteps = Object.values(Steps)
  .flat()
  .map((step) => step[0]);

interface ProgressReportContext {
  setProgressReportStep: (step: number | string) => void;
  nextStep: () => void;
  previousStep: () => void;

  step: number;
  stepName: string;
}

const ProgressReportContext = createContext<ProgressReportContext | null>(null);

const useStepState = makeQueryHandler({
  step: StringParam,
});

export const ProgressReportContextProvider = ({ children }: ChildrenProp) => {
  const [{ step: urlStep }, setStepState] = useStepState();

  const stepName = useMemo(() => {
    const name = urlStep
      ? flatSteps.find((step) => kebabCase(step) === urlStep)
      : undefined;
    return name ?? flatSteps[0]!;
  }, [urlStep]);
  const stepIndex = flatSteps.indexOf(stepName);

  const setStep = useCallback(
    (nameOrIndex: number | string) => {
      const name =
        typeof nameOrIndex === 'number' ? flatSteps[nameOrIndex] : nameOrIndex;
      setStepState({
        step: kebabCase(name),
      });
    },
    [setStepState]
  );

  const nextStep = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands -- linter is confused
    setStep(Math.min(stepIndex + 1, flatSteps.length - 1));
  }, [setStep, stepIndex]);

  const previousStep = useCallback(() => {
    setStep(Math.max(stepIndex - 1, 0));
  }, [setStep, stepIndex]);

  const value = useMemo(
    () => ({
      step: stepIndex,
      stepName,
      setProgressReportStep: setStep,
      nextStep,
      previousStep,
    }),
    [stepIndex, stepName, setStep, nextStep, previousStep]
  );

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
