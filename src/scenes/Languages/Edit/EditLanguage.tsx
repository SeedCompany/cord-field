import { useMutation } from '@apollo/client';
import { setOf } from '@seedcompany/common';
import { pick as lodashPick } from 'lodash';
import { useMemo } from 'react';
import { Except, PartialDeep, Paths, PickDeep } from 'type-fest';
import { UpdateLanguage } from '~/api/schema.graphql';
import { asDate, CalendarDate } from '~/common';
import {
  LanguageForm,
  LanguageFormProps,
  LanguageFormValues,
} from '../LanguageForm';
import { UpdateLanguageDocument } from './EditLanguage.graphql';

const pick = lodashPick as any as <T, K extends Paths<T>>(
  obj: T,
  paths: K[]
) => PartialDeep<PickDeep<T, K>>;

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
            registryOfLanguageVarietiesCode:
              language.registryOfLanguageVarietiesCode.value,
            leastOfThese: language.leastOfThese.value,
            leastOfTheseReason: language.leastOfTheseReason.value,
            isSignLanguage: language.isSignLanguage.value,
            signLanguageCode: language.signLanguageCode.value,
            sensitivity: language.sensitivity,
            sponsorEstimatedEndFY: asDate(
              language.sponsorEstimatedEndDate.value
            )?.fiscalYear,
            hasExternalFirstScripture: language.hasExternalFirstScripture.value,
          }
        : undefined,
    [language]
  );

  return (
    <LanguageForm<UpdateLanguage>
      title="Edit Language"
      {...props}
      initialValues={initialValues}
      onSubmit={async (data, form) => {
        if (!language) {
          throw new Error('Language not loaded yet');
        }
        const formState = form.getState();
        const dirtyFields = setOf(
          Object.keys(formState.dirtyFields) as Array<
            Paths<LanguageFormValues<UpdateLanguage>>
          >
        );
        const { sponsorEstimatedEndFY, ...changes } = pick(data, [
          ...dirtyFields,
        ]);

        const result = await updateLanguage({
          variables: {
            input: {
              id: language.id,
              ...changes,
              sponsorEstimatedEndDate: dirtyFields.has('sponsorEstimatedEndFY')
                ? CalendarDate.fiscalYearEndToCalendarDate(
                    sponsorEstimatedEndFY
                  ) ?? null
                : undefined,
            },
          },
        });
        return result.data!.updateLanguage.language;
      }}
    />
  );
};
