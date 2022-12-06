import { useMutation } from '@apollo/client';
import { Button, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { Form } from 'react-final-form';
import { SubmitButton } from '~/components/form';
import { RichTextField, RichTextView } from '../../../../components/RichText';
import { UpdateLanguageEngagementDocument } from '../../EditEngagement/EditEngagementDialog.graphql';
import { EngagementDescriptionFragment } from './Description.graphql';

interface Props {
  engagement: EngagementDescriptionFragment;
}

export const LanguageEngagementDescription = ({ engagement }: Props) => {
  const { description } = engagement;

  const [isEditing, setIsEditing] = useState(false);
  const [updateDescription] = useMutation(UpdateLanguageEngagementDocument);

  const EditButton = () => {
    if (!description.canEdit) {
      return null;
    }

    return (
      <Button variant="outlined" onClick={() => setIsEditing(true)}>
        {description.value ? 'Edit' : 'Add'} description
      </Button>
    );
  };

  if (isEditing) {
    return (
      <Grid container item flexDirection="column">
        <Form
          initialValues={{ description: description.value }}
          onSubmit={(values) => {
            void updateDescription({
              variables: {
                input: {
                  engagement: {
                    id: engagement.id,
                    description: values.description,
                  },
                },
              },
            });

            setIsEditing(false);
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <RichTextField name="description" />
              <SubmitButton size="medium" variant="outlined" color="primary">
                Save
              </SubmitButton>
            </form>
          )}
        </Form>
      </Grid>
    );
  }

  if (!description.value) {
    return (
      <Grid container item flexDirection="column">
        <Typography variant="body2" color="textSecondary">
          No description yet
        </Typography>
        <EditButton />
      </Grid>
    );
  }

  return (
    <Grid container item flexDirection="column">
      <RichTextView data={description.value} />
      <EditButton />
    </Grid>
  );
};
