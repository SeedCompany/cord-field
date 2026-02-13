import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { DisplayLocationFragment } from '~/common';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../components/form';
import { LocationField } from '../../../components/form/Lookup';
import { LanguageLocationsDocument } from '../Detail/Tabs/Locations/LanguageLocations.graphql';
import { AddLocationToLanguageDocument } from './EditLanguage.graphql';

interface FormValues {
  location: DisplayLocationFragment;
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
      onSubmit={async ({ location }) => {
        await addLocationToLang({
          variables: {
            language: languageId,
            location: location.id,
          },
          refetchQueries: [LanguageLocationsDocument],
        });
      }}
    >
      <SubmitError />
      <LocationField name="location" required />
    </DialogForm>
  );
};
