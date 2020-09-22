import React, { useMemo } from 'react';
import { Except } from 'type-fest';
import { UpdateLanguageInput } from '../../../api';
import { LanguageForm, LanguageFormProps } from '../LanguageForm';
import { useUpdateLanguageMutation } from './EditLanguage.generated';

export type EditLanguageProps = Except<
  LanguageFormProps<UpdateLanguageInput>,
  'onSubmit' | 'initialValues'
>;

export const EditLanguage = (props: EditLanguageProps) => {
  const [updateLanguage] = useUpdateLanguageMutation();
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
              sensitivity: language.sensitivity,
              sponsorEstimatedEndDate: language.sponsorEstimatedEndDate.value,
            },
          }
        : undefined,
    [language]
  );

  return (
    <LanguageForm<UpdateLanguageInput>
      title="Edit Language"
      {...props}
      initialValues={initialValues}
      onSubmit={async (input) => {
        await updateLanguage({
          variables: { input },
        });
      }}
    />
  );
};
