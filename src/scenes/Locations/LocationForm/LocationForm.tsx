import { Grid } from '@material-ui/core';
import React from 'react';
import {
  CreateLocation,
  displayLocationType,
  LocationTypeList,
  SensitivityList,
  UpdateLocation,
} from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  SecuredField,
  SelectField,
  SubmitError,
  TextField,
} from '../../../components/form';
import {
  FundingAccountField,
  FundingAccountLookupItem,
} from '../../../components/form/Lookup';
import { isAlpha, isLength } from '../../../components/form/validators';
import { LocationFormFragment } from './LocationForm.generated';

const locationTypeSelectOptions = LocationTypeList.map((type) => ({
  value: type,
  label: displayLocationType(type),
}));

const sensitivitySelectOptions = SensitivityList.map((sensitivity) => ({
  value: sensitivity,
  label: sensitivity,
}));

export interface LocationFormValues<
  CreateOrUpdateType extends CreateLocation | UpdateLocation
> {
  location: CreateOrUpdateType & {
    fundingAccountLookupItem?: FundingAccountLookupItem;
  };
}

export type LocationFormProps<CreateOrUpdateInput, R = void> = DialogFormProps<
  CreateOrUpdateInput,
  R
> & {
  location?: LocationFormFragment;
};

export const LocationForm = <CreateOrUpdateInput, R extends any>({
  location,
  title,
  ...rest
}: LocationFormProps<CreateOrUpdateInput, R>) => (
  <DialogForm
    DialogProps={{
      maxWidth: 'sm',
    }}
    fieldsPrefix="location"
    title={title}
    {...rest}
  >
    <SubmitError />
    <Grid container spacing={2}>
      <Grid item xs>
        <SecuredField obj={location} name="name">
          {(props) => (
            <TextField
              label="Location Name"
              placeholder="Enter Location Name"
              required
              {...props}
            />
          )}
        </SecuredField>
      </Grid>
      <Grid item xs>
        <SecuredField obj={location} name="isoAlpha3">
          {(props) => (
            <TextField
              label="Iso Alpha-3 Country Code"
              placeholder="Enter Iso Alpha-3 Country Code"
              validate={[isLength(3), isAlpha]}
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
          required
        />
      </Grid>
      <Grid item xs>
        <SecuredField obj={location} name="type">
          {(props) => (
            <SelectField
              label="Type"
              placeholder="Enter Location Type"
              selectOptions={locationTypeSelectOptions}
              required
              defaultValue="City"
              {...props}
            />
          )}
        </SecuredField>
      </Grid>
    </Grid>
    <Grid container spacing={2}>
      <Grid item xs>
        <SecuredField obj={location} name="fundingAccount">
          {(props) => (
            <FundingAccountField {...props} name="fundingAccountLookupItem" />
          )}
        </SecuredField>
      </Grid>
    </Grid>
  </DialogForm>
);
