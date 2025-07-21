import { Edit } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { canEditAny } from '~/common';
import { useDialog } from '~/components/Dialog';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '~/components/DisplaySimpleProperty';
import { EditFieldRegion } from '~/components/FieldRegion/EditFieldRegion/EditFieldRegion';
import { Link } from '~/components/Routing';
import { FieldRegionProfileFragment } from './FieldRegionProfile.graphql';

interface FieldRegionProfileProps {
  fieldRegion: FieldRegionProfileFragment;
}

export const FieldRegionProfile = ({
  fieldRegion,
}: FieldRegionProfileProps) => {
  const [editRegionState, editRegion] = useDialog();

  const canEditAnyFields = canEditAny(fieldRegion);

  return (
    <Box
      component={Paper}
      sx={(theme) => ({
        display: 'flex',
        justifyContent: 'space-between',
        width: theme.breakpoints.values.md,
        minHeight: 200,
      })}
    >
      <Stack
        sx={{
          p: 2,
          gap: 2,
        }}
      >
        <DisplayProperty
          label="Field Zone"
          value={
            <Link to={`/field-zones/${fieldRegion.fieldZone.value?.id}`}>
              {fieldRegion.fieldZone.value?.name.value}
            </Link>
          }
          loading={!fieldRegion}
        />
        <DisplayProperty
          label="Director"
          value={
            <Link to={`/users/${fieldRegion.director.value?.id}`}>
              {fieldRegion.director.value?.fullName}
            </Link>
          }
          loading={!fieldRegion}
        />
      </Stack>
      <Box sx={{ p: 1 }}>
        {canEditAnyFields ? (
          <Tooltip title="Edit Field Region">
            <IconButton aria-label="edit field region" onClick={editRegion}>
              <Edit />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>
      <EditFieldRegion fieldRegion={fieldRegion} {...editRegionState} />
    </Box>
  );
};

const DisplayProperty = (props: DisplaySimplePropertyProps) =>
  !props.value && !props.loading ? null : (
    <DisplaySimpleProperty
      variant="body1"
      {...{ component: 'div' }}
      {...props}
      loading={
        props.loading ? (
          <>
            <Typography variant="body2">
              <Skeleton width="10%" />
            </Typography>
            <Typography variant="body1">
              <Skeleton width="40%" />
            </Typography>
          </>
        ) : null
      }
      LabelProps={{
        color: 'textSecondary',
        variant: 'body2',
        ...props.LabelProps,
      }}
      ValueProps={{
        color: 'textPrimary',
        ...props.ValueProps,
      }}
    />
  );
