import { Grid } from '@mui/material';
import { without } from 'lodash';
import {
  PostShareability,
  PostShareabilityLabels,
  PostShareabilityList,
  PostType,
  PostTypeList,
} from '~/api/schema.graphql';
import { labelFrom } from '~/common';
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
import { PostFormFragment } from './PostForm.graphql';

export type PostFormProps<T, R = void> = DialogFormProps<T, R> & {
  /** The pre-existing post to edit */
  post?: PostFormFragment;
  includeMembership?: boolean;
  /**
   * Lock the post to one category and drop the picker. For a list that only
   * ever holds one kind — GTL's prayer section — asking is a way to get the
   * wrong answer.
   */
  fixedType?: PostType;
};

const shareabilityList = (includeMembership: boolean) =>
  without<PostShareability>(
    PostShareabilityList,
    ...(includeMembership ? [] : ['Membership' as const])
  );

export const PostForm = <T, R = void>({
  post,
  includeMembership = false,
  fixedType,
  ...rest
}: PostFormProps<T, R>) => (
  <DialogForm<T, R>
    DialogProps={{
      maxWidth: 'sm',
    }}
    {...rest}
  >
    <SubmitError />
    <Grid container spacing={2}>
      {!fixedType && (
        <Grid item xs>
          <SelectField
            label="Category"
            name="type"
            options={PostTypeList}
            variant="outlined"
            defaultValue="Note"
          />
        </Grid>
      )}
      <Grid item xs>
        <SelectField
          label="Shareability"
          name="shareability"
          options={shareabilityList(includeMembership)}
          variant="outlined"
          getOptionLabel={labelFrom(PostShareabilityLabels)}
          defaultValue="Internal"
        />
      </Grid>
    </Grid>
    <SecuredField obj={post} name="body">
      {(props) => (
        <TextField
          variant="outlined"
          multiline
          placeholder="Say something..."
          minRows={4}
          validate={[required, minLength()]}
          {...props}
        />
      )}
    </SecuredField>
  </DialogForm>
);
