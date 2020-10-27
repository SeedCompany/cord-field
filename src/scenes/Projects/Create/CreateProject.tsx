import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { GQLOperations } from '../../../api';
import { ButtonLink } from '../../../components/Routing';
import { updateListQueryItems } from '../../../util';
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
            projects(existingItemRefs, { readField }) {
              updateListQueryItems({
                cache,
                existingItemRefs,
                fragment: NewProjectFragmentDoc,
                fragmentName: GQLOperations.Fragment.NewProject,
                newItem: data?.createProject.project,
                readField,
              });
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
