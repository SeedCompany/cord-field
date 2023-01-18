import { useMutation } from '@apollo/client';
import { Check, Clear, Edit } from '@mui/icons-material';
import { CircularProgress, Stack, Tooltip, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { Scalars } from '~/api/schema/schema.graphql';
import { IconButton } from '../../../../components/IconButton';
import { RichTextField, RichTextView } from '../../../../components/RichText';
import { UpdateLanguageEngagementDocument } from '../../EditEngagement/EditEngagementDialog.graphql';
import { EngagementDescriptionFragment } from './Description.graphql';

interface Props {
  engagement: EngagementDescriptionFragment;
}

interface FormShape {
  description: Scalars['RichText'] | null;
}

export const LanguageEngagementDescription = ({ engagement }: Props) => {
  const { description } = engagement;

  const [isEditing, setIsEditing] = useState(false);
  const [updateDescription] = useMutation(UpdateLanguageEngagementDocument);

  const initialValues = useMemo(
    (): FormShape => ({ description: description.value ?? null }),
    [description]
  );

  if (!description.canRead) {
    return null;
  }

  return (
    <Form<FormShape>
      initialValues={initialValues}
      onSubmit={async (values, form) => {
        if (form.getState().dirty) {
          await updateDescription({
            variables: {
              input: {
                engagement: {
                  id: engagement.id,
                  description: values.description,
                },
              },
            },
          });
        }

        setIsEditing(false);
      }}
      subscription={{ submitting: true }}
    >
      {({ handleSubmit, form, submitting }) => (
        <Stack
          spacing={1}
          sx={{ mb: 4 }}
          component={isEditing ? 'form' : 'div'}
          onSubmit={handleSubmit}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h3">Description</Typography>
            {!isEditing ? (
              description.canEdit ? (
                <Tooltip title="Edit">
                  <IconButton
                    onClick={() => setIsEditing(true)}
                    aria-label="edit description"
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
              ) : null
            ) : (
              <>
                <Tooltip title="Save">
                  <IconButton
                    color="success"
                    disabled={submitting}
                    type="submit"
                  >
                    {submitting ? <CircularProgress size={24} /> : <Check />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton
                    color="error"
                    disabled={submitting}
                    onClick={() => {
                      setIsEditing(false);
                      form.reset();
                    }}
                  >
                    <Clear />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>
          {isEditing ? (
            <RichTextField name="description" />
          ) : description.value ? (
            <RichTextView data={description.value} />
          ) : (
            <Typography color="textSecondary">
              None {description.canEdit && '— click the edit pencil to add'}
            </Typography>
          )}
        </Stack>
      )}
    </Form>
  );
};
