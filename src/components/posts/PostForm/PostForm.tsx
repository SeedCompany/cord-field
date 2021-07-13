import { Grid } from '@material-ui/core';
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
  RichTextField,
  SecuredField,
  SelectField,
  SubmitError,
} from '../../form';
import { minLength, required } from '../../form/validators';
import { PostFormFragment } from './PostForm.generated';

export type PostFormProps<T, R = void> = DialogFormProps<T, R> & {
  /** The pre-existing post to edit */
  post?: PostFormFragment;
};

export const PostForm = <T, R = void>({
  post,
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
        />
      </Grid>
      <Grid item xs>
        <SelectField
          label="Shareability"
          name="shareability"
          options={PostShareabilityList}
          variant="outlined"
          getOptionLabel={displayPostShareability}
        />
      </Grid>
    </Grid>
    <SecuredField obj={post} name="body">
      {(props) => (
        <RichTextField validate={[required, minLength()]} {...props} />
      )}
    </SecuredField>
  </DialogForm>
);
