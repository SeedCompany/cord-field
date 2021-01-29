import { Grid } from '@material-ui/core';
import React from 'react';
import {
  CreateLocation,
  displayLocationType,
  LocationTypeList,
  UpdateLocation,
} from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  AlphaLowercaseField,
  SecuredField,
  SelectField,
  SubmitError,
  TextField,
} from '../../../components/form';
import {
  FundingAccountField,
  FundingAccountLookupItem,
} from '../../../components/form/Lookup';
import { LocationFormFragment } from './LocationForm.generated';

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
      <Grid item xs={12}>
        <SecuredField obj={location} name="name">
          {(props) => (
            <TextField
              label="Location Name"
              placeholder="Enter Location Name"
              required
              margin="none"
              {...props}
            />
          )}
        </SecuredField>
      </Grid>
      <Grid item xs={6}>
        <SecuredField obj={location} name="type">
          {(props) => (
            <SelectField
              label="Type"
              options={LocationTypeList}
              getOptionLabel={displayLocationType}
              defaultValue={LocationTypeList[0]}
              required
              margin="none"
              {...props}
            />
          )}
        </SecuredField>
      </Grid>
      <Grid item xs={6}>
        <SecuredField obj={location} name="isoAlpha3">
          {(props) => (
            <AlphaLowercaseField
              chars={3}
              label="ISO Alpha-3 Country Code"
              placeholder="Enter ISO Alpha-3 Country Code"
              margin="none"
              {...props}
            />
          )}
        </SecuredField>
      </Grid>
      <Grid item xs={12}>
        <SecuredField obj={location} name="fundingAccount">
          {(props) => (
            <FundingAccountField
              margin="none"
              {...props}
              name="fundingAccountLookupItem"
            />
          )}
        </SecuredField>
      </Grid>
    </Grid>
  </DialogForm>
);
