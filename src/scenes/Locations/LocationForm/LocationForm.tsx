import { Grid } from '@material-ui/core';
import React from 'react';
import {
  displayLocationType,
  LocationTypeList,
  SensitivityList,
} from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  FieldGroup,
  SecuredField,
  SelectField,
  SubmitError,
  TextField,
} from '../../../components/form';
import { LocationFormFragment } from './LocationForm.generated';

const locationTypeSelectOptions = LocationTypeList.map((type) => ({
  value: type,
  label: displayLocationType(type),
}));

const sensitivitySelectOptions = SensitivityList.map((sensitivity) => ({
  value: sensitivity,
  label: sensitivity,
}));

export type LocationFormProps<T, R = void> = DialogFormProps<T, R> & {
  location?: LocationFormFragment;
  prefix: string;
};

export const LocationForm = <T, R = void>({
  location,
  ...rest
}: LocationFormProps<T, R>) => (
  <DialogForm<T, R>
    DialogProps={{
      maxWidth: 'sm',
    }}
    {...rest}
  >
    <SubmitError />
    <FieldGroup prefix="location">
      <Grid container spacing={2}>
        <Grid item xs>
          <SecuredField obj={location} name="name">
            {(props) => (
              <TextField
                label="Location Name"
                placeholder="Enter Location Name"
                {...props}
              />
            )}
          </SecuredField>
        </Grid>
        <Grid item xs>
          <SecuredField obj={location} name="isoAlpha3">
            {(props) => (
              <TextField
                label="Iso Alpha-3 Code"
                placeholder="Enter Iso Alpha-3 Code"
                required
                {...props}
              />
            )}
          </SecuredField>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs>
          <SelectField
            label="Sensitivity"
            name="sensitivity"
            selectOptions={sensitivitySelectOptions}
            defaultValue="High"
          />
        </Grid>
        <Grid item xs>
          <SecuredField obj={location} name="type">
            {(props) => (
              <SelectField
                label="Type"
                placeholder="Enter Location Type"
                selectOptions={locationTypeSelectOptions}
                {...props}
              />
            )}
          </SecuredField>
        </Grid>
      </Grid>
    </FieldGroup>
  </DialogForm>
);
