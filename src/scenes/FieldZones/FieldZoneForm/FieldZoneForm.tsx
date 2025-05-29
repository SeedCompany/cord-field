import { Grid } from '@mui/material';
import { DisplayFieldZoneFragment } from '~/common';
import { DialogForm, DialogFormProps } from '~/components/Dialog/DialogForm';
import { SubmitError, TextField } from '~/components/form';
import { FieldGroup } from '~/components/form/FieldGroup';
import { UserField } from '~/components/form/Lookup/User/UserField';

export type FieldZoneFormProps<T, R = void> = DialogFormProps<T, R> & {
  fieldZone?: DisplayFieldZoneFragment;
  prefix: string;
};

export const FieldZoneForm = <T, R = void>({
  fieldZone,
  prefix,
  ...rest
}: FieldZoneFormProps<T, R>) => (
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
            label="Field Zone Name"
            placeholder="Enter Field Zone Name"
            required
            defaultValue={fieldZone?.name.value}
          />
        </Grid>
        <Grid item xs={12}>
          <UserField name="director" label="Director" required />
        </Grid>
      </Grid>
    </FieldGroup>
  </DialogForm>
);
