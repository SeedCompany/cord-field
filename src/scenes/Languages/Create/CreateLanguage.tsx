import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import {
  CreateLanguage as CreateLanguageType,
  GQLOperations,
} from '../../../api';
import { ButtonLink } from '../../../components/Routing';
import { CalendarDate, Nullable } from '../../../util';
import { LanguageForm, LanguageFormProps } from '../LanguageForm';
import { useCreateLanguageMutation } from './CreateLanguage.generated';

interface LanguageFormValues {
  language: Except<CreateLanguageType, 'sponsorEstimatedEndDate'> & {
    sponsorEstimatedEndFY?: Nullable<number>;
  };
}

export type CreateLanguageProps = Except<
  LanguageFormProps<LanguageFormValues>,
  'onSubmit'
>;
export const CreateLanguage = (props: CreateLanguageProps) => {
  const [createLang] = useCreateLanguageMutation();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <LanguageForm<LanguageFormValues>
      title="Create Language"
      {...props}
      onSubmit={async ({ language: { sponsorEstimatedEndFY, ...rest } }) => {
        const res = await createLang({
          variables: {
            input: {
              language: {
                sponsorEstimatedEndDate: CalendarDate.fiscalYearEndToCalendarDate(
                  sponsorEstimatedEndFY
                ),
                ...rest,
              },
            },
          },
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
