import { useMutation } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useUploadFileAsync } from '~/components/files/hooks';
import { UploadProgressReportMedia } from '../../../../../api/schema/schema.graphql';
import { StepComponent } from '../step.types';
import { VariantAccordion } from '../VariantAccordion';
import { MediaInfoForm, MediaInfoFormProps } from './MediaInfoForm';
import {
  CreateMediaDocument,
  DeleteMediaDocument,
  UpdateMediaDocument,
} from './MediaStep.graphql';

export const MediaStep: StepComponent = ({ report }) => {
  const { mediaItems, latestVariantGroupId } = useMemo(() => {
    const mediaItems = report.media.availableVariants
      .slice()
      .reverse()
      .flatMap(({ variant, canCreate }) => {
        const existing = report.media.items.find(
          (media) => media.variant.key === variant.key
        );
        return existing || canCreate ? { variant, existing } : [];
      });

    const latestVariantGroupId = mediaItems.find(
      (v) => v.existing?.variantGroup
    )?.existing?.variantGroup;

    return { mediaItems, latestVariantGroupId };
  }, [report]);

  const [createMedia] = useMutation(CreateMediaDocument);
  const [updateMedia] = useMutation(UpdateMediaDocument);
  const [deleteMedia] = useMutation(DeleteMediaDocument);
  const uploadFile = useUploadFileAsync();

  const handleSubmit: MediaInfoFormProps['onSubmit'] = async (values) => {
    if (values.submitAction === 'delete') {
      if (!values.id) {
        return;
      }
      await deleteMedia({
        variables: {
          deleteProgressReportMediaId: values.id,
        },
      });
      return;
    }

    const newFileForNewGroup =
      values.newFile && values.newFile.length > 0
        ? values.newFile[0]
        : undefined;
    const newFileForExistingGroup =
      values.newVersion && values.newVersion.length > 0
        ? values.newVersion[0]
        : undefined;
    const newFile = newFileForNewGroup || newFileForExistingGroup;

    if (!values.id) {
      if (!newFile) {
        return;
      }
      const [uploadedImageInfo, finalizeUpload] = await uploadFile(newFile);
      const input: UploadProgressReportMedia = {
        reportId: report.id,
        file: uploadedImageInfo,
        variant: values.variant.key,
        variantGroup: newFileForExistingGroup
          ? latestVariantGroupId
          : undefined,
      };
      await createMedia({
        variables: { input },
      }).then(...finalizeUpload.tap);
      return;
    }

    if (values.id) {
      await updateMedia({
        variables: {
          input: {
            id: values.id,
            category: values.category,
            caption: values.caption,
          },
        },
      });
      return;
    }
  };

  return (
    <Box sx={{ maxWidth: 'md' }}>
      <Typography variant="h3" paragraph>
        Upload an image to go with your Report
      </Typography>
      {mediaItems.map(({ variant, existing }) => (
        <VariantAccordion variant={variant} key={variant.key}>
          <MediaInfoForm
            variant={variant}
            sensitivity={report.sensitivity}
            existingMedia={existing}
            isFirstUpload={report.media.items.length === 0}
            onSubmit={handleSubmit}
          />
        </VariantAccordion>
      ))}
    </Box>
  );
};

MediaStep.enableWhen = ({ report }) =>
  report.media.availableVariants.length > 0;
