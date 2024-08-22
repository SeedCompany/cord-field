import { Box, Stack } from '@mui/material';
import { useMemo } from 'react';
import {
  ProgressReportMediaCategory as Category,
  Sensitivity,
} from '~/api/schema.graphql';
import {
  ProgressReportMediaCategoryLabels,
  ProgressReportMediaCategoryList,
} from '~/api/schema/enumLists';
import { labelFrom } from '~/common';
import { VariantFragment } from '~/common/fragments';
import {
  Form,
  FormProps,
  SelectField,
  SubmitAction,
  SubmitError,
  TextField,
} from '~/components/form';
import { ImageField } from './ImageField';
import { ProgressReportMediaFragment } from './progressReportMedia.graphql';

interface MediaFormState extends SubmitAction<'delete'> {
  variant: VariantFragment;
  id?: string;
  newFile?: File[];
  newVersion?: File[];
  category?: Category | null;
  caption?: string | null;
}

export type MediaInfoFormProps = Omit<
  FormProps<MediaFormState>,
  'initialValues'
> & {
  sensitivity: Sensitivity;
  variant: VariantFragment;
  existingMedia?: ProgressReportMediaFragment;
  isFirstUpload: boolean;
};

export const MediaInfoForm = ({
  existingMedia,
  sensitivity,
  variant,
  isFirstUpload,
  ...props
}: MediaInfoFormProps) => {
  const existingFile =
    existingMedia?.media.__typename === 'Image'
      ? existingMedia.media
      : existingMedia?.media.__typename === 'Video'
      ? existingMedia.media
      : undefined;

  const initialValues = useMemo(
    () => ({
      variant,
      id: existingMedia?.id,
      category: existingMedia?.category,
      caption: existingFile?.caption,
      variantGroup: existingMedia?.variantGroup,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [variant, existingMedia]
  );

  return (
    <Form<MediaFormState>
      autoSubmit
      {...props}
      initialValues={initialValues}
      sendIfClean="delete"
    >
      {({ handleSubmit }) => (
        <>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              mb: 1,
            }}
          >
            {!existingFile && !isFirstUpload && (
              <ImageField
                name="newVersion"
                sensitivity={sensitivity}
                canDelete={false}
                sx={{ flex: 1, mt: 1, minWidth: 195 }}
                instructionMessage="Click or drop to add an edited version of the previous role's image"
              />
            )}
            <ImageField
              name="newFile"
              current={existingFile}
              sensitivity={sensitivity}
              canDelete={existingMedia?.canDelete ?? false}
              sx={{ flex: 1, mt: 1, minWidth: 195 }}
              instructionMessage={
                isFirstUpload
                  ? 'Click or drop to add an image'
                  : 'Click or drop to add a completely different image, because the previous is not suitable'
              }
            />
            {existingFile && (
              <Stack gap="inherit" flex={2} minWidth={270}>
                <SelectField
                  label="Photo Category"
                  name="category"
                  disabled={!existingMedia?.canEdit}
                  options={ProgressReportMediaCategoryList}
                  variant="outlined"
                  getOptionLabel={labelFrom(ProgressReportMediaCategoryLabels)}
                  helperText={false}
                />
                <TextField
                  variant="outlined"
                  multiline
                  name="caption"
                  label="Caption"
                  disabled={!existingMedia?.canEdit}
                  placeholder="Enter Photo Caption"
                  minRows={3}
                  margin="none"
                />
              </Stack>
            )}
          </Box>
          <SubmitError />
        </>
      )}
    </Form>
  );
};
