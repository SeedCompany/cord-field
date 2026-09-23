import { kebabCase } from 'lodash';
import { makeQueryHandler, StringParam } from '~/hooks';

const useStepState = makeQueryHandler({
  step: StringParam,
});

/**
 * Which wizard step is showing, kept in the URL as `?step=`.
 *
 * A slug rather than an index so a link keeps working when steps are added,
 * removed, or hidden for a given role — matching how the Momentum wizard
 * addresses its steps.
 */
export const useGtlStep = (labels: readonly string[]) => {
  const [{ step }, setStepState] = useStepState();
  const current =
    labels.find((label) => kebabCase(label) === step) ?? labels[0] ?? '';
  return {
    current,
    setStep: (label: string) => setStepState({ step: kebabCase(label) }),
  };
};
