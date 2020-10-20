import { Grid } from '@mui/material';
import { Merge } from 'type-fest';
import {
  CreateLocation,
  LocationTypeLabels,
  LocationTypeList,
  UpdateLocation,
} from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  IsoCountry,
  IsoCountryField,
  SecuredField,
  SelectField,
  SubmitError,
  TextField,
} from '../../../components/form';
import {
  FundingAccountField,
  FundingAccountLookupItem,
} from '../../../components/form/Lookup/FundingAccount';
import { LocationFormFragment } from './LocationForm.graphql';

export interface LocationFormValues<
  CreateOrUpdateType extends CreateLocation | UpdateLocation
> {
  location: Merge<
    CreateOrUpdateType,
    {
      isoAlpha3?: IsoCountry | null;
      fundingAccountId?: FundingAccountLookupItem | null;
    }
  >;
}

export type LocationFormProps<CreateOrUpdateInput, R = void> = DialogFormProps<
  CreateOrUpdateInput,
  R
> & {
  location?: LocationFormFragment;
};

export const LocationForm = <CreateOrUpdateInput, R extends any>({
  location,
  ...rest
}: LocationFormProps<CreateOrUpdateInput, R>) => (
  <DialogForm
    DialogProps={{
      maxWidth: 'sm',
    }}
    fieldsPrefix="location"
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
              getOptionLabel={labelFrom(LocationTypeLabels)}
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
            <IsoCountryField
              label="ISO Country"
              placeholder="Select an ISO Country"
              {...props}
            />
          )}
        </SecuredField>
      </Grid>
      <Grid item xs={12}>
        <SecuredField obj={location} name="fundingAccountId">
          {(props) => <FundingAccountField margin="none" {...props} />}
        </SecuredField>
      </Grid>
    </Grid>
  </DialogForm>
);
