import { kebabCase } from 'lodash';
import { createContext, useContext, useMemo } from 'react';
import { ChildrenProp } from '~/common';
import { useSession } from '~/components/Session';
import { makeQueryHandler, StringParam } from '~/hooks';
import { ReportProp } from './ReportProp';
import {
  GroupedIncompleteSteps,
  GroupedStepMapShape,
  IncompleteSeverity,
  StepComponent,
} from './Steps';

interface ProgressReportContext {
  groupedStepMap: GroupedStepMapShape;
  incompleteSteps: GroupedIncompleteSteps;
  incompleteSeverities: ReadonlySet<IncompleteSeverity>;
  CurrentStep: StepComponent;
  isLast: boolean;
  isFirst: boolean;
  nextStep: () => void;
  previousStep: () => void;
  setProgressReportStep: (step: number | string) => void;
}

const ProgressReportContext = createContext<ProgressReportContext | null>(null);

const useStepState = makeQueryHandler({
  step: StringParam,
});

export const ProgressReportContextProvider = ({
  report,
  children,
  steps,
}: { steps: GroupedStepMapShape } & Partial<ReportProp> & ChildrenProp) => {
  const [{ step: urlStep }, setStepState] = useStepState();

  const { groupedStepMap, stepMap, flatSteps } = useMemo(() => {
    const groupedStepMap = Object.fromEntries(
      Object.entries(steps).flatMap(([title, steps]) => {
        const enabled = steps.filter(([_, { enableWhen }]) =>
          report == null ? true : enableWhen?.({ report }) ?? true
        );
        return enabled.length > 0 ? [[title, enabled]] : [];
      })
    );
    const stepMap = Object.fromEntries(Object.values(groupedStepMap).flat());
    const flatSteps = Object.keys(stepMap);
    return { groupedStepMap, stepMap, flatSteps };
  }, [report, steps]);

  const { session } = useSession();
  const currentUserRoles = useMemo(
    () => new Set(session?.roles.value),
    [session]
  );

  const { incompleteSteps, incompleteSeverities } = useMemo(() => {
    const incompleteSeverities = new Set<IncompleteSeverity>();
    const incompleteSteps = Object.fromEntries(
      Object.entries(groupedStepMap).flatMap(([title, steps]) => {
        const incompleteSteps = steps.flatMap(([label, step]) => {
          if (!report || !step.isIncomplete) {
            return [];
          }
          const { isIncomplete, severity } = step.isIncomplete({
            report,
            currentUserRoles,
          });
          incompleteSeverities.add(severity);
          return isIncomplete ? { label, step, severity } : [];
        });
        return incompleteSteps.length > 0 ? [[title, incompleteSteps]] : [];
      })
    );
    return { incompleteSteps, incompleteSeverities };
  }, [currentUserRoles, groupedStepMap, report]);

  const context = useMemo(() => {
    const stepName =
      (urlStep
        ? flatSteps.find((step) => kebabCase(step) === urlStep)
        : undefined) ?? flatSteps[0]!;
    const stepIndex = flatSteps.indexOf(stepName);

    const setStep = (nameOrIndex: number | string) => {
      const name =
        typeof nameOrIndex === 'number' ? flatSteps[nameOrIndex] : nameOrIndex;
      setStepState({
        step: kebabCase(name),
      });
    };

    const context: ProgressReportContext = {
      CurrentStep: stepMap[stepName] ?? Noop,
      groupedStepMap,
      incompleteSteps,
      incompleteSeverities,
      isFirst: stepIndex <= 0,
      isLast: stepIndex >= flatSteps.length - 1,
      setProgressReportStep: setStep,
      nextStep: () => {
        setStep(Math.min(stepIndex + 1, flatSteps.length - 1));
      },
      previousStep: () => {
        setStep(Math.max(stepIndex - 1, 0));
      },
    };
    return context;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlStep, setStepState, report]);

  return (
    <ProgressReportContext.Provider value={context}>
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

const Noop = (_props: unknown) => null;
