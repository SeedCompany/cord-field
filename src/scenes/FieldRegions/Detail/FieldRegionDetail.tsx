import { useQuery } from '@apollo/client';
import { Edit } from '@mui/icons-material';
import { Box, Skeleton, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { canEditAny } from '~/common';
import { useDialog } from '~/components/Dialog';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '~/components/DisplaySimpleProperty';
import { EditFieldRegion } from '~/components/FieldRegion';
import { Link } from '~/components/Routing';
import { Error } from '../../../components/Error';
import { Fab } from '../../../components/Fab';
import { Redacted } from '../../../components/Redacted';
import { FieldRegionDetailDocument } from './FieldRegionDetail.graphql';

export const FieldRegionDetail = () => {
  const { fieldRegionId = '' } = useParams();

  const [editRegionState, editRegion] = useDialog();

  const { data, error } = useQuery(FieldRegionDetailDocument, {
    variables: { fieldRegionId },
  });

  const fieldRegion = data?.fieldRegion;

  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        p: 4,
      }}
    >
      <Helmet title={fieldRegion?.name.value || undefined} />
      <Error error={error}>
        {{
          NotFound: 'Could not find field region',
          Default: 'Error loading field region',
        }}
      </Error>
      {!error && (
        <Box
          sx={{
            maxWidth: (theme) => theme.breakpoints.values.md,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Box
            component="header"
            sx={{
              flex: 1,
              display: 'flex',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                mr: 4,
                width: !fieldRegion?.name.value ? '40%' : undefined,
              }}
            >
              {!fieldRegion ? (
                <Skeleton width="100%" />
              ) : (
                fieldRegion.name.value ?? (
                  <Redacted
                    info="You don't have permission to view this field region's name"
                    width="40%"
                  />
                )
              )}
            </Typography>
            {canEditAny(fieldRegion, true) && (
              <Fab
                color="primary"
                aria-label="edit region"
                onClick={editRegion}
                loading={!fieldRegion}
              >
                <Edit />
              </Fab>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Typography variant="h4">
              {fieldRegion ? 'Field Region' : <Skeleton width={200} />}
            </Typography>
          </Box>
          <DisplayProperty
            label="Field Zone"
            value={
              <Link to={`/field-zones/${fieldRegion?.fieldZone.value?.id}`}>
                {fieldRegion?.fieldZone.value?.name.value}
              </Link>
            }
            loading={!fieldRegion}
          />
          <DisplayProperty
            label="Director"
            value={
              <Link to={`/users/${fieldRegion?.director.value?.id}`}>
                {fieldRegion?.director.value?.fullName}
              </Link>
            }
            loading={!fieldRegion}
          />
        </Box>
      )}
      {fieldRegion && (
        <EditFieldRegion fieldRegion={fieldRegion} {...editRegionState} />
      )}
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
