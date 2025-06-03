import { Grid } from '@mui/material';
import { DisplayFieldRegionFragment } from '~/common';
import { DialogForm, DialogFormProps } from '~/components/Dialog/DialogForm';
import { SubmitError, TextField } from '~/components/form';
import { FieldGroup } from '~/components/form/FieldGroup';
import { FieldZoneField } from '~/components/form/Lookup/FieldZone';
import { UserField } from '~/components/form/Lookup/User/UserField';

export type FieldRegionFormProps<T, R = void> = DialogFormProps<T, R> & {
  fieldRegion?: DisplayFieldRegionFragment;
  prefix: string;
};

export const FieldRegionForm = <T, R = void>({
  fieldRegion,
  prefix,
  ...rest
}: FieldRegionFormProps<T, R>) => (
  <DialogForm<T, R>
    DialogProps={{
      maxWidth: 'sm',
    }}
    {...rest}
  >
    <SubmitError />
    <FieldGroup prefix={prefix}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="name"
            label="Field Region Name"
            placeholder="Enter Field Region Name"
            required
            defaultValue={fieldRegion?.name.value}
          />
        </Grid>
        <Grid item xs={12}>
          <FieldZoneField name="fieldZone" label="Field Zone" required />
        </Grid>
        <Grid item xs={12}>
          <UserField name="director" label="Director" required />
        </Grid>
      </Grid>
    </FieldGroup>
  </DialogForm>
);
