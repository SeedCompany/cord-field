import { useMutation } from '@apollo/client';
import { Delete } from '@mui/icons-material';
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { type ProgressReportMediaCategory } from '~/api/schema.graphql';
import {
  ProgressReportMediaCategoryLabels,
  ProgressReportMediaCategoryList,
} from '~/api/schema/enumLists';
import { labelFrom } from '~/common';
import { useUploadFileAsync } from '~/components/files/hooks';
import {
  DropzoneField,
  Form,
  SavingStatus,
  SelectField,
  SubmitError,
  TextField,
} from '../../../components/form';
import { IconButton } from '../../../components/IconButton';
import {
  DeleteGtlReportMediaDocument,
  type GtlMediaFragment,
  UpdateGtlReportMediaDocument,
  UploadGtlReportMediaDocument,
} from './GtlReportDetail.graphql';

/**
 * Photos, video and audio for the quarter.
 *
 * Deliberately a flat list, unlike Momentum's media step: that one is a set of
 * accordions because a highlight is the same image re-cut per audience. Nothing
 * here is re-cut, so an upload is an upload.
 */
export const MediaCard = ({
  reportId,
  media,
  editable = true,
}: {
  reportId: string;
  media: readonly GtlMediaFragment[];
  editable?: boolean;
}) => {
  const uploadFile = useUploadFileAsync();
  const [upload] = useMutation(UploadGtlReportMediaDocument);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Photos, Video & Audio
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Anything you captured this quarter — a workshop, a dedication, a
          recording of the first draft being read aloud.
        </Typography>

        {editable && (
          <Form<{ files?: File[] }>
            onSubmit={async ({ files }, form) => {
              const file = files?.[0];
              if (!file) return;
              const [uploaded, finalize] = await uploadFile(file);
              await upload({
                variables: { input: { report: reportId, file: uploaded } },
              }).then(...finalize.tap);
              // Otherwise the dropzone keeps showing the file it just consumed
              // and a second drop submits both.
              form.reset({});
            }}
            autoSubmit
          >
            {({ handleSubmit, submitting }) => (
              <form onSubmit={handleSubmit}>
                <SubmitError />
                <DropzoneField
                  name="files"
                  disabled={submitting}
                  accept={{ 'image/*': [], 'video/*': [], 'audio/*': [] }}
                  disableFileList
                />
                <SavingStatus submitting={submitting} />
              </form>
            )}
          </Form>
        )}

        {media.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Nothing uploaded yet.
          </Typography>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {media.map((item) => (
              <Grid item xs={12} sm={6} key={item.id}>
                <MediaItem item={item} editable={editable} />
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

const MediaItem = ({
  item,
  editable,
}: {
  item: GtlMediaFragment;
  editable: boolean;
}) => {
  const [update] = useMutation(UpdateGtlReportMediaDocument);
  const [remove] = useMutation(DeleteGtlReportMediaDocument, {
    variables: { id: item.id },
  });

  return (
    <Card variant="outlined">
      <CardContent>
        <Preview item={item} />
        {!editable ? (
          <>
            {item.caption.value && (
              <Typography variant="body2">{item.caption.value}</Typography>
            )}
            {item.category.value && (
              <Typography variant="caption" color="text.secondary">
                {labelFrom(ProgressReportMediaCategoryLabels)(
                  item.category.value
                )}
              </Typography>
            )}
          </>
        ) : (
          <Form<{
            caption?: string | null;
            category?: ProgressReportMediaCategory | null;
          }>
            onSubmit={async (values) => {
              await update({
                variables: {
                  input: {
                    id: item.id,
                    caption: values.caption ?? null,
                    category: values.category ?? null,
                  },
                },
              });
            }}
            initialValues={{
              caption: item.caption.value,
              category: item.category.value,
            }}
            autoSubmit
            keepDirtyOnReinitialize
          >
            {({ handleSubmit, submitting }) => (
              <form onSubmit={handleSubmit}>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <TextField name="caption" label="Caption" sx={{ flex: 1 }} />
                  {item.canDelete && (
                    <IconButton size="small" onClick={() => void remove()}>
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
                <SelectField
                  name="category"
                  label="Category"
                  options={ProgressReportMediaCategoryList}
                  getOptionLabel={labelFrom(ProgressReportMediaCategoryLabels)}
                  variant="outlined"
                />
                <SavingStatus submitting={submitting} />
              </form>
            )}
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * What the browser can actually play, chosen by mime type rather than by the
 * media's GraphQL type — a file whose sidecar hasn't been detected yet has no
 * `media`, and the name alone is better than an empty box.
 */
const Preview = ({ item }: { item: GtlMediaFragment }) => {
  const url = item.media?.url;
  const mimeType = item.media?.mimeType ?? item.file.value?.mimeType ?? '';

  if (!url) {
    return (
      <Typography variant="body2" color="text.secondary" paragraph>
        {item.file.value?.name ?? 'Processing…'}
      </Typography>
    );
  }
  if (mimeType.startsWith('video/')) {
    return <Box component="video" src={url} controls sx={{ width: 1 }} />;
  }
  if (mimeType.startsWith('audio/')) {
    return <Box component="audio" src={url} controls sx={{ width: 1 }} />;
  }
  return (
    <Box
      component="img"
      src={url}
      alt={item.caption.value ?? ''}
      sx={{ width: 1, borderRadius: 1, display: 'block', mb: 1 }}
    />
  );
};
