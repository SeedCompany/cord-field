import { useQuery } from '@apollo/client';
import { Edit } from '@mui/icons-material';
import { Box, Skeleton, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { LocationTypeLabels } from '~/api/schema.graphql';
import { canEditAny, labelFrom } from '~/common';
import { useDialog } from '../../../components/Dialog';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '../../../components/DisplaySimpleProperty';
import { Error } from '../../../components/Error';
import { Fab } from '../../../components/Fab';
import { FormattedDateTime } from '../../../components/Formatters';
import { Redacted } from '../../../components/Redacted';
import { EditLocation } from '../Edit';
import { LocationDocument } from './LocationDetail.graphql';

export const LocationDetail = () => {
  const { locationId = '' } = useParams();

  const [editLocationState, editLocation] = useDialog();

  const { data, error } = useQuery(LocationDocument, {
    variables: { locationId },
  });
  const location = data?.location;
  const fundingAccount = location?.fundingAccount.value;

  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        overflowY: 'auto',
        p: 4,
      }}
    >
      <Helmet title={location?.name.value || undefined} />
      <Error error={error}>
        {{
          NotFound: 'Could not find location',
          Default: 'Error loading location',
        }}
      </Error>
      {!error && (
        <Box
          sx={{
            maxWidth: 'md',
            '& > *': {
              mb: 3,
            },
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
            }}
          >
            <Typography
              variant="h2"
              sx={[
                {
                  mr: 4,
                },
                location?.name
                  ? null
                  : {
                      width: '40%',
                    },
              ]}
            >
              {!location ? (
                <Skeleton width="100%" />
              ) : (
                location.name.value ?? (
                  <Redacted
                    info="You don't have permission to view this location's name"
                    width="40%"
                  />
                )
              )}
            </Typography>
            {canEditAny(location, true) && (
              <Fab
                color="primary"
                aria-label="edit location"
                onClick={editLocation}
                loading={!location}
              >
                <Edit />
              </Fab>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              '& > *': {
                mr: 2,
              },
            }}
          >
            <Typography variant="h4">
              {location ? 'Location' : <Skeleton width={200} />}
            </Typography>
            {location && (
              <Typography variant="body2" color="textSecondary">
                Created <FormattedDateTime date={location.createdAt} />
              </Typography>
            )}
          </Box>
          <DisplayProperty
            label="Type"
            value={labelFrom(LocationTypeLabels)(location?.type.value)}
            loading={!location}
          />
          <DisplayProperty
            label="ISO Alpha-3 Country Code"
            value={location?.isoAlpha3.value}
            loading={!location}
          />
          <DisplayProperty
            label="Funding Account"
            value={`${fundingAccount?.name.value ?? ''}${
              fundingAccount?.accountNumber.value
                ? ` (${fundingAccount.accountNumber.value})`
                : ''
            }`}
            loading={!location}
          />
        </Box>
      )}
      <EditLocation location={location} {...editLocationState} />
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
