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
import { EditFieldZone } from '~/components/FieldZone';
import { Link } from '~/components/Routing';
import { FieldZoneProfileFragment } from './FieldZoneProfile.graphql';

interface FieldZoneProfileProps {
  fieldZone: FieldZoneProfileFragment;
}

export const FieldZoneProfile = ({ fieldZone }: FieldZoneProfileProps) => {
  const [editZoneState, editZone] = useDialog();

  const canEditAnyFields = canEditAny(fieldZone);

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
          label="Director"
          value={
            <Link to={`/users/${fieldZone.director.value?.id}`}>
              {fieldZone.director.value?.fullName}
            </Link>
          }
          loading={!fieldZone}
        />
      </Stack>
      <Box sx={{ p: 1 }}>
        {canEditAnyFields ? (
          <Tooltip title="Edit Field Zone">
            <IconButton aria-label="edit field Zone" onClick={editZone}>
              <Edit />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>
      <EditFieldZone fieldZone={fieldZone} {...editZoneState} />
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
