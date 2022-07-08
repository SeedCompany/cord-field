import { useMutation } from '@apollo/client';
import React, { useMemo } from 'react';
import { Except } from 'type-fest';
import { UpdateLanguage } from '~/api/schema';
import { CalendarDate } from '~/common';
import {
  LanguageForm,
  LanguageFormProps,
  LanguageFormValues,
} from '../LanguageForm';
import { UpdateLanguageDocument } from './EditLanguage.graphql';

export type EditLanguageProps = Except<
  LanguageFormProps<LanguageFormValues<UpdateLanguage>>,
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
        const result = await updateLanguage({
          variables: {
            input: {
              language: {
                populationOverride: populationOverride ?? null,
                sponsorEstimatedEndDate:
                  CalendarDate.fiscalYearEndToCalendarDate(
                    sponsorEstimatedEndFY
                  ),
                ethnologue: {
                  ...ethnologue,
                  code: ethnologue?.code ?? null,
                  provisionalCode: ethnologue?.provisionalCode ?? null,
                },
                ...rest,
              },
            },
          },
        });
        return result.data!.updateLanguage.language;
      }}
    />
  );
};
