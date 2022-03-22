import { useMutation } from '@apollo/client';
import React from 'react';
import { Except } from 'type-fest';
import {
  addItemToList,
  CreateProjectChangeRequestInput,
  displayProjectChangeRequestType,
  ProjectChangeRequestTypeList,
} from '../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../../components/form';
import { AutocompleteField } from '../../../../components/form/AutocompleteField';
import { ProjectOverviewQuery } from '../../Overview/ProjectOverview.graphql';
import { ProjectChangeRequestListQuery as ListQuery } from '../List';
import {
  CreateProjectChangeRequestDocument as CreateChangeRequest,
  CreateProjectChangeRequestMutation as Mutation,
} from './CreateProjectChangeRequest.graphql';

type CreateProjectChangeRequestProps = Except<
  DialogFormProps<
    CreateProjectChangeRequestInput,
    Mutation['createProjectChangeRequest']['projectChangeRequest']
  >,
  'onSubmit'
> & {
  project: ListQuery['project'] | ProjectOverviewQuery['project'];
};

export const CreateProjectChangeRequest = ({
  project,
  ...props
}: CreateProjectChangeRequestProps) => {
  const [createChangeRequest] = useMutation(CreateChangeRequest, {
    update: addItemToList({
      listId: [project, 'changeRequests'],
      outputToItem: (data) =>
        data.createProjectChangeRequest.projectChangeRequest,
    }),
  });

  return (
    <DialogForm
      {...props}
      title="Create Change Request"
      fieldsPrefix="projectChangeRequest"
      onSubmit={async ({ projectChangeRequest: input }) => {
        const { data } = await createChangeRequest({
          variables: {
            input: {
              projectChangeRequest: {
                ...input,
                projectId: project.id,
              },
            },
          },
        });
        return data!.createProjectChangeRequest.projectChangeRequest;
      }}
    >
      <SubmitError />
      <AutocompleteField
        multiple
        options={ProjectChangeRequestTypeList}
        getOptionLabel={displayProjectChangeRequestType}
        name="types"
        label="Types"
        variant="outlined"
        required
      />
      <TextField
        name="summary"
        label="Summary"
        placeholder="Why is this change request needed?"
        variant="outlined"
        required
        multiline
        inputProps={{ rowsMin: 2 }}
      />
    </DialogForm>
  );
};
