import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { CreateLanguage as CreateLanguageType } from '../../../api';
import { LanguageListItemFragmentDoc } from '../../../components/LanguageListItemCard/LanguageListItem.generated';
import { ButtonLink } from '../../../components/Routing';
import { addItemToList, CalendarDate } from '../../../util';
import {
  LanguageForm,
  LanguageFormProps,
  LanguageFormValues,
} from '../LanguageForm';
import { CreateLanguageDocument } from './CreateLanguage.generated';

export type CreateLanguageProps = Except<
  LanguageFormProps<LanguageFormValues<CreateLanguageType>>,
  'onSubmit'
>;
export const CreateLanguage = (props: CreateLanguageProps) => {
  const [createLang] = useMutation(CreateLanguageDocument, {
    update: addItemToList(
      'languages',
      LanguageListItemFragmentDoc,
      (data) => data.createLanguage.language
    ),
  });
  const { enqueueSnackbar } = useSnackbar();

  return (
    <LanguageForm<LanguageFormValues<CreateLanguageType>>
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
