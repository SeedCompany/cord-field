import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { DisplayLocationFragment } from '~/common';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../components/form';
import { LocationField } from '../../../components/form/Lookup';
import { AddLocationToLanguageDocument } from './EditLanguage.graphql';

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
      <LocationField name="locationId" required />
    </DialogForm>
  );
};
