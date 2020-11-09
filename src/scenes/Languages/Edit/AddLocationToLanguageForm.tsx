import { useMutation } from '@apollo/client';
import React from 'react';
import { Except } from 'type-fest';
import { DisplayLocationFragment } from '../../../api/fragments/location.generated';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../components/form';
import { LocationField } from '../../../components/form/Lookup';
import { AddLocationToLanguageDocument } from './EditLanguage.generated';

interface FormValues {
  locationId: DisplayLocationFragment;
}

type AddLocationToLanguageFormProps = Except<
  DialogFormProps<FormValues>,
  'onSubmit' | 'initialValues'
> & {
  languageId: string;
};

export const AddLocationToLanguageForm = ({
  languageId,
  ...props
}: AddLocationToLanguageFormProps) => {
  const [addLocationToLang] = useMutation(AddLocationToLanguageDocument);

  return (
    <DialogForm<FormValues>
      title="Add Location"
      {...props}
      onSubmit={async ({ locationId }) => {
        const variables = {
          languageId,
          locationId: locationId.id,
        };

        await addLocationToLang({ variables });
      }}
    >
      <SubmitError />
      <LocationField name="locationId" required variant="outlined" />
    </DialogForm>
  );
};
