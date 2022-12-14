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
  after?: () => Promisable<void>;
}

export const useExecuteTransition = ({
  id,
  after,
}: UseExecuteTransitionParams) => {
  const [executeTransition] = useMutation(TransitionProgressReportDocument);

  return async (values: TransitionFormValues) => {
    const isBypass = values.submitAction === 'bypass';
    if (isBypass && !values.bypassStatus) {
      return;
    }

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

    await after?.();
  };
};
