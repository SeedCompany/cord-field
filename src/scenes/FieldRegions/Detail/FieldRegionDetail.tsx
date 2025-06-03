import { useQuery } from '@apollo/client';
import { Edit } from '@mui/icons-material';
import { Box, Skeleton, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { canEditAny } from '~/common';
import { DetailProperty } from '~/components/DetailProperty';
import { useDialog } from '~/components/Dialog';
import { Error } from '../../../components/Error';
import { Fab } from '../../../components/Fab';
import { FormattedDateTime } from '../../../components/Formatters';
import { Redacted } from '../../../components/Redacted';
import { EditFieldRegion } from '../Edit';
import { FieldRegionDocument } from './FieldRegionDetail.graphql';

export const FieldRegionDetail = () => {
  const { fieldRegionId = '' } = useParams();

  const [editRegionState, editRegion] = useDialog();

  const { data, error } = useQuery(FieldRegionDocument, {
    variables: { fieldRegionId },
  });

  const fieldRegion = data?.fieldRegion;

  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        overflowY: 'auto',
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
                width: !fieldRegion?.name ? '40%' : undefined,
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
              alignItems: 'baseline',
              gap: 2,
            }}
          >
            <Typography variant="h4">
              {fieldRegion ? 'Field Region' : <Skeleton width={200} />}
            </Typography>
            {fieldRegion && (
              <Typography variant="body2" color="textSecondary">
                Created <FormattedDateTime date={fieldRegion.createdAt} />
              </Typography>
            )}
          </Box>
          <DetailProperty
            label="Field Zone"
            value={fieldRegion?.fieldZone.value?.name.value}
            loading={!fieldRegion}
          />
          <DetailProperty
            label="Director"
            value={fieldRegion?.director.value?.fullName}
            loading={!fieldRegion}
          />
        </Box>
      )}
      <EditFieldRegion fieldRegion={fieldRegion} {...editRegionState} />
    </Box>
  );
};
