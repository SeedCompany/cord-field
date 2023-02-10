import { useMutation } from '@apollo/client';
import { Promisable } from 'type-fest';
import {
  Scalars,
  ProgressReportStatus as Status,
} from '~/api/schema/schema.graphql';
import { SubmitAction } from '~/components/form';
import { TransitionProgressReportDocument } from './TransitionProgressReport.graphql';

export interface TransitionFormValues extends SubmitAction<'bypass'> {
  notes?: Scalars['RichText'];
  bypassStatus?: Status;
}

interface UseExecuteTransitionParams {
  id: string;
  before?: (values: TransitionFormValues) => Promisable<void>;
  after?: (values: TransitionFormValues) => Promisable<void>;
}

export const useExecuteTransition = ({
  id,
  before,
  after,
}: UseExecuteTransitionParams) => {
  const [executeTransition] = useMutation(TransitionProgressReportDocument);

  return async (values: TransitionFormValues) => {
    const isBypass = values.submitAction === 'bypass';
    if (isBypass && !values.bypassStatus) {
      return;
    }

    await before?.(values);

    await executeTransition({
      variables: {
        input: {
          report: id,
          ...(isBypass
            ? { status: values.bypassStatus }
            : { transition: values.submitAction }),
          notes: values.notes,
        },
      },
    });

    await after?.(values);
  };
};
