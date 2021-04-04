import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
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
  const [createPlanChnage] = useMutation(CreatePlanChangeDocument);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <CreatePlanChangeForm
      onSuccess={() =>
        enqueueSnackbar(`Created change to plan`, {
          variant: 'success',
        })
      }
      {...props}
      onSubmit={async (input) => {
        const { data } = await createPlanChnage({
          variables: { input },
        });
        return data!.createPlanChange.planChange;
      }}
    />
  );
};
