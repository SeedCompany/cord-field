import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { GQLOperations } from '../../../api';
import { ButtonLink } from '../../../components/Routing';
import { useCreateProjectMutation } from './CreateProject.generated';
import {
  CreateProjectForm,
  CreateProjectFormProps as Props,
} from './CreateProjectForm';

export const CreateProject = (props: Except<Props, 'onSubmit'>) => {
  const [createProject] = useCreateProjectMutation();
  const { enqueueSnackbar } = useSnackbar();
  const submit: Props['onSubmit'] = async (input) => {
    const res = await createProject({
      variables: { input },
      refetchQueries: [GQLOperations.Query.ProjectList],
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
