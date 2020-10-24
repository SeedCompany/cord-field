import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { ButtonLink } from '../../../components/Routing';
import {
  CreateProjectDocument,
  NewProjectFragmentDoc,
} from './CreateProject.generated';
import {
  CreateProjectForm,
  CreateProjectFormProps as Props,
} from './CreateProjectForm';

export const CreateProject = (props: Except<Props, 'onSubmit'>) => {
  const [createProject] = useMutation(CreateProjectDocument);
  const { enqueueSnackbar } = useSnackbar();
  const submit: Props['onSubmit'] = async (input) => {
    const res = await createProject({
      variables: { input },
      update(cache, { data }) {
        cache.modify({
          fields: {
            projects(existingProjectRefs, { readField }) {
              const newProject = data?.createProject.project;
              if (!newProject) return existingProjectRefs;
              const newProjectRef = cache.writeFragment({
                data: newProject,
                fragment: NewProjectFragmentDoc,
              });
              if (
                existingProjectRefs?.items.some(
                  (ref: any) => readField('id', ref) === newProject.id
                )
              ) {
                return existingProjectRefs;
              }
              return {
                ...existingProjectRefs,
                items: [...existingProjectRefs.items, newProjectRef],
              };
            },
          },
        });
      },
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
