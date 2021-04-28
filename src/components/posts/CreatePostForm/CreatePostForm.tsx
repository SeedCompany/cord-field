import { MutationUpdaterFn, useMutation } from '@apollo/client';
import { Grid, makeStyles } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { Form } from 'react-final-form';
import { PostTypeList } from '../../../api';
import { SelectField, SubmitButton, SwitchField, TextField } from '../../form';
import { minLength, required } from '../../form/validators';
import { CreatePostDocument, CreatePostMutation } from './CreatePost.generated';

interface CreatePostFormProps {
  parentId: string;
  mutationUpdate?: MutationUpdaterFn<CreatePostMutation>;
  onSubmit?: () => void;
}

const useStyles = makeStyles(({ spacing }) => ({
  options: {
    marginBottom: spacing(-4),
  },
  typeField: {
    minWidth: 200,
  },
}));

export const CreatePostForm = ({
  parentId,
  mutationUpdate,
  onSubmit,
}: CreatePostFormProps) => {
  const [createPost] = useMutation(CreatePostDocument, {
    update: mutationUpdate,
  });
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  return (
    <Form
      initialValues={{
        body: '',
        type: 'Note',
        shareable: true,
      }}
      onSubmit={async (values) => {
        await createPost({
          variables: {
            input: {
              post: {
                parentId,
                body: values.body,
                type: values.type,
                shareable: values.shareable,
              },
            },
          },
        });

        enqueueSnackbar(`Comment posted`, {
          variant: 'success',
        });

        if (onSubmit) {
          onSubmit();
        }
      }}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Grid
            container
            wrap="nowrap"
            direction="row"
            alignItems="center"
            spacing={3}
            className={classes.options}
          >
            <Grid item className={classes.typeField}>
              <SelectField
                label="Category"
                name="type"
                options={PostTypeList}
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <SwitchField label="Public" name="shareable" />
            </Grid>
          </Grid>
          <TextField
            name="body"
            variant="outlined"
            multiline
            placeholder="Start a new comment"
            inputProps={{ rowsMin: 4 }}
            validate={[required, minLength()]}
          />
          <SubmitButton
            color="secondary"
            size="medium"
            fullWidth={false}
            disableElevation
          >
            Post Comment
          </SubmitButton>
        </form>
      )}
    </Form>
  );
};
