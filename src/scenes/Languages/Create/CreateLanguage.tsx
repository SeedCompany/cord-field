import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import {
  CreateLanguage as CreateLanguageType,
  GQLOperations,
} from '../../../api';
import { ButtonLink } from '../../../components/Routing';
import { CalendarDate, updateListQueryItems } from '../../../util';
import {
  LanguageForm,
  LanguageFormProps,
  LanguageFormValues,
} from '../LanguageForm';
import {
  CreateLanguageDocument,
  NewLanguageFragmentDoc,
} from './CreateLanguage.generated';

export type CreateLanguageProps = Except<
  LanguageFormProps<LanguageFormValues<CreateLanguageType>>,
  'onSubmit'
>;
export const CreateLanguage = (props: CreateLanguageProps) => {
  const [createLang] = useMutation(CreateLanguageDocument);
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
          update(cache, { data }) {
            cache.modify({
              fields: {
                languages(existingItemRefs, { readField }) {
                  updateListQueryItems({
                    cache,
                    existingItemRefs,
                    fragment: NewLanguageFragmentDoc,
                    fragmentName: GQLOperations.Fragment.NewLanguage,
                    newItem: data?.createLanguage.language,
                    readField,
                  });
                },
              },
            });
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
