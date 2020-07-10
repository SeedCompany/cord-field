import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { CreateLanguageInput, GQLOperations } from '../../../api';
import { ButtonLink } from '../../../components/Routing';
import { LanguageForm } from '../LanguageForm';
import { CreateLanguageFormProps as Props } from './CreateLangaugeForm';
import { useCreateLanguageMutation } from './CreateLanguage.generated';

export const CreateLanguage = (props: Except<Props, 'onSubmit'>) => {
  const [createLang] = useCreateLanguageMutation();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <LanguageForm<CreateLanguageInput>
      title="Create Language"
      {...props}
      prefix="language"
      onSubmit={async (input) => {
        const res = await createLang({
          variables: { input },
          refetchQueries: [GQLOperations.Query.Languages],
        });

        const { language } = res.data!.createLanguage;

        enqueueSnackbar(`Created language: ${language.name.value}`, {
          variant: 'success',
          action: () => (
            <ButtonLink color="inherit" to={`/languages/${language.id}`}>
              View
            </ButtonLink>
          ),
        });
      }}
    />
  );
};
