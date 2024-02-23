import { useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { Except } from 'type-fest';
import { UpdateLanguage } from '~/api/schema.graphql';
import { CalendarDate } from '~/common';
import { LanguageForm, LanguageFormProps } from '../LanguageForm';
import { UpdateLanguageDocument } from './EditLanguage.graphql';

export type EditLanguageProps = Except<
  LanguageFormProps<UpdateLanguage>,
  'onSubmit' | 'initialValues'
>;

export const EditLanguage = (props: EditLanguageProps) => {
  const [updateLanguage] = useMutation(UpdateLanguageDocument);
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
                language.sponsorEstimatedEndDate.value?.fiscalYear,
              hasExternalFirstScripture:
                language.hasExternalFirstScripture.value,
            },
          }
        : undefined,
    [language]
  );

  return (
    <LanguageForm<UpdateLanguage>
      title="Edit Language"
      {...props}
      initialValues={initialValues}
      onSubmit={async ({
        language: { sponsorEstimatedEndFY, ...language },
      }) => {
        const result = await updateLanguage({
          variables: {
            input: {
              language: {
                ...language,
                sponsorEstimatedEndDate:
                  CalendarDate.fiscalYearEndToCalendarDate(
                    sponsorEstimatedEndFY
                  ),
              },
            },
          },
        });
        return result.data!.updateLanguage.language;
      }}
    />
  );
};
