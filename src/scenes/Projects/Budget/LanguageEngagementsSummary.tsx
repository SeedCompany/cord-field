import { Box, Chip, Popover, Stack, Typography } from '@mui/material';
import { EngagementStatusLabels } from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import { idForUrl } from '../../../components/Changeset';
import { DisplaySimpleProperty } from '../../../components/DisplaySimpleProperty';
import { Link } from '../../../components/Routing';
import { ProjectBudgetQuery } from './ProjectBudget.graphql';
import { useHoverPopoverAnchor } from './useHoverPopoverAnchor';

type EngagementItem =
  ProjectBudgetQuery['project']['engagements']['items'][number];
type LanguageEngagementItem = Extract<
  EngagementItem,
  { readonly __typename?: 'LanguageEngagement' }
>;

const isLanguageEngagement = (
  item: EngagementItem
): item is LanguageEngagementItem => item.__typename === 'LanguageEngagement';

interface LanguageEngagementsSummaryProps {
  /** `budget.value.languageCount.value ?? 0` -- the count the header shows;
   * kept separate from `engagements.length` since the two are fetched
   * independently and needn't ever perfectly agree. */
  count: number;
  engagements: readonly EngagementItem[];
}

/**
 * budget-line-items-poc: header item pairing the existing "Language
 * Engagements" count with a hover/click popover listing each engagement --
 * grouped with Cost Per Language in the header because that stat's
 * denominator IS this count (see ProjectBudget.tsx). Popover open/close
 * follows the `Notifications.tsx` anchorEl convention, extended to also
 * open on hover (mouse) rather than click-only (that component's use case).
 * Open/close timing is handled by `useHoverPopoverAnchor` -- see that file
 * for why a naive per-element mouseenter/mouseleave pair flickers.
 */
export const LanguageEngagementsSummary = ({
  count,
  engagements,
}: LanguageEngagementsSummaryProps) => {
  const { anchorEl, open, triggerProps, paperProps, rootProps, close } =
    useHoverPopoverAnchor();
  const items = engagements.filter(isLanguageEngagement);

  return (
    <>
      <DisplaySimpleProperty
        label="Language Engagements"
        // `0` is falsy, and `DisplaySimpleProperty` renders nothing when
        // `value` is falsy -- stringify so a genuinely-zero count still
        // shows "Language Engagements: 0" rather than disappearing.
        value={String(count)}
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
        {items.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            No language engagements yet
          </Typography>
        ) : (
          <Stack spacing={1}>
            {items.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
              >
                {/* budget-line-items-poc (item 3): links to the engagement's
                    own page -- `idForUrl` needs `...Id` on this selection
                    (see ProjectBudget.graphql). */}
                <Link variant="body2" to={`/engagements/${idForUrl(item)}`}>
                  {item.language.value?.displayName.value ?? '—'}
                </Link>
                <Chip
                  size="small"
                  variant="outlined"
                  label={labelFrom(EngagementStatusLabels)(item.status.value)}
                />
              </Stack>
            ))}
          </Stack>
        )}
      </Popover>
    </>
  );
};
