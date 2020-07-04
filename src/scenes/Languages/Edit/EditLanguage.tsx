import * as React from 'react';
import { FC } from 'react';
import { Except } from 'type-fest';
import { GQLOperations } from '../../../api';
import { useUpdateLanguageMutation } from './EditLanguage.generated';
import {
  EditLanguageForm,
  EditLanguageFormProps as Props,
} from './EditLanguageForm';

type EditLanguageProps = Except<Props, 'onSubmit'>;

export const EditLanguage: FC<EditLanguageProps> = (props) => {
  const [updateLanguage] = useUpdateLanguageMutation();

  const submit: Props['onSubmit'] = async (input) => {
    await updateLanguage({
      variables: { input },
      refetchQueries: [GQLOperations.Query.Languages],
    });
  };

  return <EditLanguageForm onSubmit={submit} {...props} />;
};
