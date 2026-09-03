import { useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';
import { groupToMapBy } from '@seedcompany/common';
import { useMemo, useState } from 'react';
import { Sensitivity } from '~/api/schema.graphql';
import { useUploadFileAsync } from '~/components/files/hooks';
import { UploadProgressReportMedia } from '../../../../../api/schema/schema.graphql';
import { ReportProp } from '../../ReportProp';
import { StepComponent } from '../step.types';
import { VariantAccordion } from '../VariantAccordion';
import { MediaInfoForm, MediaInfoFormProps } from './MediaInfoForm';
import {
  CreateMediaDocument,
  DeleteMediaDocument,
  UpdateMediaDocument,
} from './MediaStep.graphql';
import { ProgressReportMediaFragment } from './progressReportMedia.graphql';

// The last variant is Investor Communications — see highlights.dto.ts on the
// API. A photo's published-variant row IS the selection: whoever can edit
// that variant chooses which photos go to investors simply by uploading (or
// not) into that row, the same act that already sends every other report
// section to investors. No separate "select for publishing" control exists
// because none is needed — this reuses the mechanism the rest of the report
// already runs on.
const PUBLISHED_VARIANT_KEY = 'published';

export const MediaStep: StepComponent = ({ report }) => {
  const [addingGroup, setAddingGroup] = useState(false);

  const groups = useMemo(() => {
    const byGroup = groupToMapBy(report.media.items, (m) => m.variantGroup);
    return [...byGroup.entries()].map(([variantGroup, items]) => ({
      variantGroup,
      items,
    }));
  }, [report.media.items]);

  const canAddGroup = report.media.availableVariants.some((v) => v.canCreate);

  return (
    <Box sx={{ maxWidth: 'md' }}>
      <Typography variant="h3" paragraph>
        Upload images to go with your Report
      </Typography>

      <Stack spacing={4} divider={<Divider />}>
        {groups.map((group) => (
          <PhotoGroup
            key={group.variantGroup}
            report={report}
            variantGroup={group.variantGroup}
            items={group.items}
          />
        ))}

        {addingGroup ? (
          <PhotoGroup
            report={report}
            variantGroup={undefined}
            items={[]}
            onUploaded={() => setAddingGroup(false)}
          />
        ) : (
          canAddGroup && (
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setAddingGroup(true)}
              sx={{ alignSelf: 'flex-start' }}
            >
              {groups.length === 0 ? 'Upload a Photo' : 'Upload Another Photo'}
            </Button>
          )
        )}
      </Stack>
    </Box>
  );
};

MediaStep.enableWhen = ({ report }) =>
  report.media.availableVariants.length > 0;

/**
 * One uploaded photo, across its whole editorial lane — draft through
 * Investor Communications — exactly as the single-photo step always rendered
 * it. The only thing new here is that a report can now hold several of these
 * side by side instead of exactly one.
 */
interface PhotoGroupReport {
  id: string;
  sensitivity: Sensitivity;
  media: ReportProp['report']['media'];
}

const PhotoGroup = ({
  report,
  variantGroup,
  items,
  onUploaded,
}: {
  report: PhotoGroupReport;
  variantGroup: string | undefined;
  items: readonly ProgressReportMediaFragment[];
  onUploaded?: () => void;
}) => {
  const mediaItems = useMemo(() => {
    return report.media.availableVariants
      .slice()
      .reverse()
      .flatMap(({ variant, canCreate }) => {
        const existing = items.find(
          (media) => media.variant.key === variant.key
        );
        return existing || canCreate ? { variant, existing } : [];
      });
  }, [report.media.availableVariants, items]);

  const [createMedia] = useMutation(CreateMediaDocument);
  const [updateMedia] = useMutation(UpdateMediaDocument);
  const [deleteMedia] = useMutation(DeleteMediaDocument);
  const uploadFile = useUploadFileAsync();

  const published = items.find((m) => m.variant.key === PUBLISHED_VARIANT_KEY);

  const handleSubmit: MediaInfoFormProps['onSubmit'] = async (values) => {
    if (values.submitAction === 'delete') {
      if (!values.id) return;
      await deleteMedia({
        variables: { deleteProgressReportMediaId: values.id },
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
      if (!newFile) return;
      const [uploadedImageInfo, finalizeUpload] = await uploadFile(newFile);
      const input: UploadProgressReportMedia = {
        report: report.id,
        file: uploadedImageInfo,
        variant: values.variant.key,
        variantGroup: newFileForExistingGroup ? variantGroup : undefined,
      };
      await createMedia({ variables: { input } }).then(...finalizeUpload.tap);
      onUploaded?.();
      return;
    }

    await updateMedia({
      variables: {
        input: {
          id: values.id,
          category: values.category,
          caption: values.caption,
        },
      },
    });
  };

  return (
    <Box>
      {items.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {published ? (
            <Chip
              label="Included in Investor Report"
              color="primary"
              size="small"
            />
          ) : (
            <Chip
              label="Not yet in Investor Report"
              variant="outlined"
              size="small"
            />
          )}
        </Box>
      )}
      {mediaItems.map(({ variant, existing }) => (
        <VariantAccordion variant={variant} key={variant.key}>
          <MediaInfoForm
            variant={variant}
            sensitivity={report.sensitivity}
            existingMedia={existing}
            isFirstUpload={items.length === 0}
            onSubmit={handleSubmit}
          />
        </VariantAccordion>
      ))}
    </Box>
  );
};
