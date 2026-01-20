import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import {
  CreateProjectChangeRequest as CreateProjectChangeRequestInput,
  ProjectChangeRequestTypeLabels,
  ProjectChangeRequestTypeList,
} from '~/api/schema.graphql';
import { labelFrom } from '~/common';
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
      onSubmit={async (input) => {
        const { data } = await createChangeRequest({
          variables: {
            input: {
              ...input,
              project: project.id,
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
        getOptionLabel={labelFrom(ProjectChangeRequestTypeLabels)}
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
        minRows={2}
      />
    </DialogForm>
  );
};
