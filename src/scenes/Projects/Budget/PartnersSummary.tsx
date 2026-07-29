import { Box, Divider, Popover, Stack, Typography } from '@mui/material';
import { DisplaySimpleProperty } from '../../../components/DisplaySimpleProperty';
import { Link } from '../../../components/Routing';
import { useHoverPopoverAnchor } from './useHoverPopoverAnchor';

export interface PartnerSummaryItem {
  /** Organization id -- list key, matches `partnerOrganizations` above. */
  id: string;
  /** Partner entity's own id -- what `/partners/:id` actually expects
   * (confirmed via PartnerNameColumn.tsx / PartnerListItemCard.tsx /
   * ProductInfo.tsx), distinct from the organization id above. */
  partnerId: string;
  name: string;
}

interface PartnersSummaryProps {
  partners: readonly PartnerSummaryItem[];
  projectId: string;
}

/**
 * budget-line-items-poc: header item pairing a "Partners" count with a
 * hover/click popover listing this project's partner organizations --
 * shares its open/close timing with `LanguageEngagementsSummary` via
 * `useHoverPopoverAnchor` (see that file for why). Kept as a sibling
 * component rather than factoring out a shared generic *rendering* wrapper
 * -- the link targets and the trailing "view all partnerships" link differ
 * enough that a generic markup abstraction wouldn't save much -- but the
 * hover-popover behavior itself is shared so the two can't drift out of
 * sync again.
 */
export const PartnersSummary = ({
  partners,
  projectId,
}: PartnersSummaryProps) => {
  const { anchorEl, open, triggerProps, paperProps, rootProps, close } =
    useHoverPopoverAnchor();

  return (
    <>
      <DisplaySimpleProperty
        label="Partners"
        // `0` is falsy, and `DisplaySimpleProperty` renders nothing when
        // `value` is falsy -- stringify so a genuinely-zero count still
        // shows "Partners: 0" rather than disappearing.
        value={String(partners.length)}
        wrap={(node) => (
          <Box
            component="span"
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={open}
            {...triggerProps}
            sx={{ cursor: 'pointer' }}
          >
            {node}
          </Box>
        )}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        disableRestoreFocus
        slotProps={{
          paper: {
            ...paperProps,
            // Merge, don't replace -- `paperProps.sx` carries the
            // `pointerEvents: 'auto'` override `rootProps` depends on it
            // for (see useHoverPopoverAnchor's doc comment).
            sx: {
              ...paperProps.sx,
              p: 2,
              minWidth: 240,
              maxWidth: 360,
              maxHeight: 400,
            },
          },
          root: rootProps,
        }}
      >
        <Stack spacing={1}>
          {/* One link, not per-row -- no standalone per-partnership page
              exists (Partnerships are only ever listed at this project-
              scoped route). */}
          <Link variant="body2" to={`/projects/${projectId}/partnerships`}>
            View all partnerships
          </Link>
          <Divider />
          {partners.length === 0 ? (
            <Typography color="text.secondary" variant="body2">
              No partners yet
            </Typography>
          ) : (
            partners.map((partner) => (
              <Link
                key={partner.id}
                variant="body2"
                to={`/partners/${partner.partnerId}`}
              >
                {partner.name}
              </Link>
            ))
          )}
        </Stack>
      </Popover>
    </>
  );
};
