import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { addItemToList } from '../../../api';
import { ButtonLink } from '../../../components/Routing';
import { ProjectListQueryVariables } from '../List/projects.generated';
import { CreateProjectDocument } from './CreateProject.generated';
import {
  CreateProjectForm,
  CreateProjectFormProps as Props,
} from './CreateProjectForm';

export const CreateProject = (props: Except<Props, 'onSubmit'>) => {
  const [createProject] = useMutation(CreateProjectDocument, {
    update: addItemToList({
      listId: 'projects',
      outputToItem: (data) => data.createProject.project,
      filter: (args: ProjectListQueryVariables) =>
        args.input.filter?.pinned ?? false,
    }),
  });
  const { enqueueSnackbar } = useSnackbar();
  const submit: Props['onSubmit'] = async (input) => {
    const res = await createProject({
      variables: { input },
    });
    const project = res.data!.createProject.project;

    enqueueSnackbar(`Created project: ${project.name.value}`, {
      variant: 'success',
      action: () => (
        <ButtonLink color="inherit" to={`/projects/${project.id}`}>
          View
        </ButtonLink>
      ),
    });
  };

  return <CreateProjectForm {...props} onSubmit={submit} />;
};
