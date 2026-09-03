import { useMutation } from '@apollo/client';
import {
  Add,
  Audiotrack,
  ExpandMore,
  Image as ImageIcon,
  Videocam,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
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
  ReuseMediaDocument,
  UpdateMediaDocument,
} from './MediaStep.graphql';
import { ProgressReportMediaFragment } from './progressReportMedia.graphql';

// The last variant is Investor Communications — see highlights.dto.ts on the
// API. An item's published-variant row IS the selection: whoever can edit
// that variant chooses what goes to investors simply by uploading (or not)
// into that row, the same act that already sends every other report section
// to investors. No separate "select for publishing" control exists because
// none is needed — this reuses the mechanism the rest of the report already
// runs on.
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
  const totalVariantSlots = report.media.availableVariants.length;

  return (
    <Box sx={{ maxWidth: 'md' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 1,
        }}
      >
        <Typography variant="h3">
          Media
          {groups.length > 0 && (
            <Typography
              component="span"
              variant="h3"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              ({groups.length})
            </Typography>
          )}
        </Typography>
        {canAddGroup && !addingGroup && (
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setAddingGroup(true)}
          >
            {groups.length === 0 ? 'Upload Media' : 'Upload Another Item'}
          </Button>
        )}
      </Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        Photos, videos, or audio — each item can carry a different version per
        role, collapsed here to its furthest-along version. Expand one to see,
        edit, or add the rest.
      </Typography>

      <Stack spacing={2} divider={<Divider />}>
        {groups.map((group) => (
          <MediaGroup
            key={group.variantGroup}
            report={report}
            variantGroup={group.variantGroup}
            items={group.items}
            totalVariantSlots={totalVariantSlots}
          />
        ))}

        {addingGroup && (
          <MediaGroup
            report={report}
            variantGroup={undefined}
            items={[]}
            totalVariantSlots={totalVariantSlots}
            defaultExpanded
            onUploaded={() => setAddingGroup(false)}
          />
        )}
      </Stack>
    </Box>
  );
};

MediaStep.enableWhen = ({ report }) =>
  report.media.availableVariants.length > 0;

/**
 * One uploaded item — photo, video, or audio — across its whole editorial
 * lane — draft through Investor Communications — exactly as the
 * single-item step always rendered it. The only thing new here is that a
 * report can now hold several of these side by side instead of exactly one.
 */
interface MediaGroupReport {
  id: string;
  sensitivity: Sensitivity;
  media: ReportProp['report']['media'];
}

const MediaGroup = ({
  report,
  variantGroup,
  items,
  totalVariantSlots,
  defaultExpanded = false,
  onUploaded,
}: {
  report: MediaGroupReport;
  variantGroup: string | undefined;
  items: readonly ProgressReportMediaFragment[];
  totalVariantSlots: number;
  defaultExpanded?: boolean;
  onUploaded?: () => void;
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const orderIndex = useMemo(
    () =>
      new Map(report.media.availableVariants.map((v, i) => [v.variant.key, i])),
    [report.media.availableVariants]
  );

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
  const [reuseMedia] = useMutation(ReuseMediaDocument);
  const uploadFile = useUploadFileAsync();

  const published = items.find((m) => m.variant.key === PUBLISHED_VARIANT_KEY);

  // The furthest-along version is what best represents this item at a
  // glance — usually what an investor would eventually see, or the closest
  // thing to it uploaded so far.
  const furthestAlong = [...items].sort(
    (a, b) =>
      (orderIndex.get(b.variant.key) ?? 0) -
      (orderIndex.get(a.variant.key) ?? 0)
  )[0];

  const handleSubmit: MediaInfoFormProps['onSubmit'] = async (values) => {
    if (values.submitAction === 'delete') {
      if (!values.id) return;
      await deleteMedia({
        variables: { deleteProgressReportMediaId: values.id },
      });
      return;
    }

    const newFile =
      values.newFile && values.newFile.length > 0
        ? values.newFile[0]
        : values.newVersion && values.newVersion.length > 0
        ? values.newVersion[0]
        : undefined;

    if (!values.id) {
      if (!newFile) return;
      const [uploadedImageInfo, finalizeUpload] = await uploadFile(newFile);
      const input: UploadProgressReportMedia = {
        report: report.id,
        file: uploadedImageInfo,
        variant: values.variant.key,
        // Whichever of the two upload fields was used, the result belongs to
        // this same item — `variantGroup` is undefined only when this whole
        // group is itself being created from scratch (the "Upload Media"
        // button's flow), never because of which field the file came through.
        variantGroup,
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

  const reuse = (sourceId: string, targetVariant: string) =>
    reuseMedia({
      variables: { input: { id: sourceId, variant: targetVariant } },
    });

  const filledCount = items.length;

  const summary = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width: '100%',
      }}
    >
      <MediaThumbnail media={furthestAlong?.media} />
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2">
          {filledCount} of {totalVariantSlots} roles uploaded
        </Typography>
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
    </Box>
  );

  // A brand new group has nothing to summarize yet, so it always renders
  // expanded straight to the upload form rather than a collapsed shell
  // around zero items.
  if (items.length === 0) {
    return (
      <Box>
        {mediaItems.map(({ variant, existing }) => (
          <VariantAccordion variant={variant} key={variant.key} expanded>
            <MediaInfoForm
              variant={variant}
              sensitivity={report.sensitivity}
              existingMedia={existing}
              isFirstUpload
              onSubmit={handleSubmit}
            />
          </VariantAccordion>
        ))}
      </Box>
    );
  }

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, next) => setExpanded(next)}
      square
      disableGutters
      elevation={0}
      sx={{ '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>{summary}</AccordionSummary>
      <AccordionDetails sx={{ px: 0 }}>
        {mediaItems.map(({ variant, existing }) => {
          const reuseSources = existing
            ? []
            : items.filter(
                (i) =>
                  (orderIndex.get(i.variant.key) ?? 0) <
                  (orderIndex.get(variant.key) ?? 0)
              );
          return (
            <VariantAccordion variant={variant} key={variant.key}>
              {reuseSources.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Already uploaded for this item — reuse it here instead of
                    uploading again. The caption and category can still be
                    edited separately once it's added.
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {reuseSources.map((source) => (
                      <Button
                        key={source.id}
                        size="small"
                        variant="outlined"
                        onClick={() => void reuse(source.id, variant.key)}
                      >
                        Use {source.variant.label}'s file
                      </Button>
                    ))}
                  </Stack>
                </Box>
              )}
              <MediaInfoForm
                variant={variant}
                sensitivity={report.sensitivity}
                existingMedia={existing}
                isFirstUpload={false}
                onSubmit={handleSubmit}
              />
            </VariantAccordion>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};

/**
 * A real thumbnail for a photo; for video/audio (and anything unrecognized)
 * a type icon instead, since there's no static frame or waveform to show
 * here without fetching and decoding the file itself.
 */
const MediaThumbnail = ({
  media,
}: {
  media: ProgressReportMediaFragment['media'] | undefined;
}) => {
  if (media?.__typename === 'Image') {
    return (
      <Avatar
        variant="rounded"
        src={media.url}
        sx={{ width: 56, height: 56 }}
      />
    );
  }
  const Icon =
    media?.__typename === 'Video'
      ? Videocam
      : media?.__typename === 'Audio'
      ? Audiotrack
      : ImageIcon;
  return (
    <Avatar variant="rounded" sx={{ width: 56, height: 56 }}>
      <Icon />
    </Avatar>
  );
};
