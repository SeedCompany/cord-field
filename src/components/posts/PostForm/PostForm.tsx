import { Grid } from '@material-ui/core';
import { without } from 'lodash';
import React from 'react';
import {
  displayPostShareability,
  PostShareabilityList,
  PostTypeList,
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
import { minLength, required } from '../../form/validators';
import { PostFormFragment } from './PostForm.generated';

export type PostFormProps<T, R = void> = DialogFormProps<T, R> & {
  /** The pre-existing post to edit */
  post?: PostFormFragment;
  includeMembership?: boolean;
};

const shareabilityList = (includeMembership: boolean) =>
  without(PostShareabilityList, includeMembership ? null : 'Membership');

export const PostForm = <T, R = void>({
  post,
  includeMembership = false,
  ...rest
}: PostFormProps<T, R>) => (
  <DialogForm<T, R>
    DialogProps={{
      maxWidth: 'sm',
    }}
    fieldsPrefix="post"
    {...rest}
  >
    <SubmitError />
    <Grid container spacing={2}>
      <Grid item xs>
        <SelectField
          label="Category"
          name="type"
          options={PostTypeList}
          variant="outlined"
          defaultValue={'Note'}
        />
      </Grid>
      <Grid item xs>
        <SelectField
          label="Shareability"
          name="shareability"
          options={shareabilityList(includeMembership)}
          variant="outlined"
          getOptionLabel={displayPostShareability}
          defaultValue={'Internal'}
        />
      </Grid>
    </Grid>
    <SecuredField obj={post} name="body">
      {(props) => (
        <TextField
          variant="outlined"
          multiline
          placeholder="Say something..."
          inputProps={{ rowsMin: 4 }}
          validate={[required, minLength()]}
          {...props}
        />
      )}
    </SecuredField>
  </DialogForm>
);
