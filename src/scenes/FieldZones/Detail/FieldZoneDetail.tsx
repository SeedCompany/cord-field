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
import { Link } from '~/components/Routing';
import { Error } from '../../../components/Error';
import { Fab } from '../../../components/Fab';
import { EditFieldZone } from '../../../components/FieldZone';
import { Redacted } from '../../../components/Redacted';
import { FieldZoneDetailDocument } from './FieldZoneDetail.graphql';

export const FieldZoneDetail = () => {
  const { fieldZoneId = '' } = useParams();

  const [editZoneState, editZone] = useDialog();

  const { data, error } = useQuery(FieldZoneDetailDocument, {
    variables: { fieldZoneId },
  });

  const fieldZone = data?.fieldZone;

  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        p: 4,
      }}
    >
      <Helmet title={fieldZone?.name.value || undefined} />
      <Error error={error}>
        {{
          NotFound: 'Could not find field zone',
          Default: 'Error loading field zone',
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
                width: !fieldZone?.name.value ? '40%' : undefined,
              }}
            >
              {!fieldZone ? (
                <Skeleton width="100%" />
              ) : (
                fieldZone.name.value ?? (
                  <Redacted
                    info="You don't have permission to view this field zone's name"
                    width="40%"
                  />
                )
              )}
            </Typography>
            {canEditAny(fieldZone, true) && (
              <Fab
                color="primary"
                aria-label="edit zone"
                onClick={editZone}
                loading={!fieldZone}
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
              {fieldZone ? 'Field Zone' : <Skeleton width={200} />}
            </Typography>
          </Box>

          <DisplayProperty
            label="Director"
            value={
              <Link to={`/users/${fieldZone?.director.value?.id}`}>
                {fieldZone?.director.value?.fullName}
              </Link>
            }
            loading={!fieldZone}
          />
        </Box>
      )}
      {fieldZone && <EditFieldZone fieldZone={fieldZone} {...editZoneState} />}
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
