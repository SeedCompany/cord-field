import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { addItemToList } from '../../../../api';
import { ProjectOverviewQuery } from '../../Overview/ProjectOverview.generated';
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
  project: PlanChangesQuery['project'] | ProjectOverviewQuery['project'];
};

export const CreatePlanChange = ({
  project,
  ...props
}: CreatePlanChangeProps) => {
  const [createPlanChange] = useMutation(CreatePlanChangeDocument, {
    update: addItemToList({
      listId: [project, 'planChanges'],
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
        const { data } = await createPlanChange({
          variables: {
            input: {
              planChange: {
                ...planChange,
                status: 'Pending',
                projectId: project.id,
              },
            },
          },
        });
        return data!.createPlanChange.planChange;
      }}
    />
  );
};
