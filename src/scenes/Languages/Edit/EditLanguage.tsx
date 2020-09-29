import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Except } from 'type-fest';
import { GQLOperations, UpdateLanguage } from '../../../api';
import { SubmitButton } from '../../../components/form';
import { CalendarDate } from '../../../util';
import {
  LanguageForm,
  LanguageFormProps,
  LanguageFormValues,
} from '../LanguageForm';
import { LanguagesDocument } from '../List/languages.generated';
import {
  useDeleteLanguageMutation,
  useUpdateLanguageMutation,
} from './EditLanguage.generated';

export type EditLanguageProps = Except<
  LanguageFormProps<LanguageFormValues<UpdateLanguage>>,
  'onSubmit' | 'initialValues'
>;

export const EditLanguage = (props: EditLanguageProps) => {
  const [updateLanguage] = useUpdateLanguageMutation();

  const [deleteLanguage] = useDeleteLanguageMutation({
    //FIXME: for some reason this query isn't executing
    refetchQueries: [GQLOperations.Query.Languages],
    awaitRefetchQueries: true,
  });

  const navigate = useNavigate();

  const language = props.language;

  const initialValues = useMemo(
    () =>
      language
        ? {
            language: {
              id: language.id,
              name: language.name.value,
              displayName: language.displayName.value,
              displayNamePronunciation: language.displayNamePronunciation.value,
              isDialect: language.isDialect.value,
              ethnologue: {
                code: language.ethnologue.code.value,
                provisionalCode: language.ethnologue.provisionalCode.value,
                name: language.ethnologue.name.value,
                population: language.ethnologue.population.value,
              },
              populationOverride: language.populationOverride.value,
              registryOfDialectsCode: language.registryOfDialectsCode.value,
              leastOfThese: language.leastOfThese.value,
              leastOfTheseReason: language.leastOfTheseReason.value,
              isSignLanguage: language.isSignLanguage.value,
              signLanguageCode: language.signLanguageCode.value,
              sensitivity: language.sensitivity,
              sponsorEstimatedEndFY:
                language.sponsorEstimatedEndDate.value &&
                CalendarDate.toFiscalYear(
                  language.sponsorEstimatedEndDate.value
                ),
            },
          }
        : undefined,
    [language]
  );

  return (
    <LanguageForm<LanguageFormValues<UpdateLanguage>>
      title="Edit Language"
      {...props}
      initialValues={initialValues}
      onSubmit={async ({
        language: {
          populationOverride,
          sponsorEstimatedEndFY,
          ethnologue,
          ...rest
        },
      }) => {
        await updateLanguage({
          variables: {
            input: {
              language: {
                populationOverride: populationOverride ?? null,
                sponsorEstimatedEndDate: CalendarDate.fiscalYearEndToCalendarDate(
                  sponsorEstimatedEndFY
                ),
                ethnologue: {
                  ...ethnologue,
                  //TODO: implement the rest of the null overrides on edit language
                  code: ethnologue?.code ?? null,
                  provisionalCode: ethnologue?.provisionalCode ?? null,
                },
                ...rest,
              },
            },
          },
        });
      }}
      leftAction={
        <SubmitButton
          action="delete"
          color="error"
          fullWidth={false}
          variant="text"
          onClick={async () => {
            await deleteLanguage({
              variables: {
                languageId: language?.id || '',
              },
              update: (cache, { data }) => {
                if (data?.deleteLanguage) {
                  console.log('cache: ', cache);
                  // updateSessionCache(cache);
                  const currentLanguages = cache.readQuery({
                    query: LanguagesDocument,
                    variables: {
                      input: {},
                    },
                  });
                  console.log('currentLanguages: ', currentLanguages);
                }
              },
            });
            navigate('../');
          }}
        >
          Delete
        </SubmitButton>
      }
    />
  );
};

// const updateSessionCache(cache)
