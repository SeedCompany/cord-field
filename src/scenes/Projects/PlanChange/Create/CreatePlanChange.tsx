import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { addItemToList, PlanChangeStatus } from '../../../../api';
import { PlanChangesQuery } from '../List/PlanChanges.generated';
import {
  CreatePlanChangeDocument,
  CreatePlanChangeMutation,
} from './CreatePlanChange.generated';
import {
  CreatePlanChangeForm,
  CreatePlanChangeFormProps,
} from './CreatePlanChangeForm';

type CreatePlanChangeProps = Except<
  CreatePlanChangeFormProps<
    CreatePlanChangeMutation['createPlanChange']['planChange']
  >,
  'onSubmit'
> & {
  project: PlanChangesQuery['project'];
};

export const CreatePlanChange = ({
  project,
  ...props
}: CreatePlanChangeProps) => {
  const [createPlanChnage] = useMutation(CreatePlanChangeDocument, {
    update: addItemToList({
      listId: [project, 'changes'],
      outputToItem: (data) => data.createPlanChange.planChange,
    }),
  });
  const { enqueueSnackbar } = useSnackbar();

  return (
    <CreatePlanChangeForm
      onSuccess={() =>
        enqueueSnackbar(`Created change to plan`, {
          variant: 'success',
        })
      }
      {...props}
      onSubmit={async ({ planChange }) => {
        const input = {
          planChange: {
            ...planChange,
            status: 'Pending' as PlanChangeStatus,
            projectId: project.id,
          },
        };
        const { data } = await createPlanChnage({
          variables: { input },
        });
        return data!.createPlanChange.planChange;
      }}
    />
  );
};
