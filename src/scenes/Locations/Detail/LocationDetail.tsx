import { useQuery } from '@apollo/client';
import { Edit } from '@mui/icons-material';
import { Skeleton, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
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
import { StyledRemoteSvg } from '../../../components/StyledRemoteSvg';
import { EditLocation } from '../Edit';
import { LocationDocument } from './LocationDetail.graphql';

const useStyles = makeStyles()(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing(4),
  },
  main: {
    maxWidth: breakpoints.values.md,
    '& > *': {
      marginBottom: spacing(3),
    },
  },
  name: {
    marginRight: spacing(4),
  },
  nameLoading: {
    width: '40%',
  },
  header: {
    flex: 1,
    display: 'flex',
  },
  subheader: {
    display: 'flex',
    alignItems: 'baseline',
    '& > *': {
      marginRight: spacing(2),
    },
  },
}));

export const LocationDetail = () => {
  const { classes, cx } = useStyles();
  const { locationId = '' } = useParams();

  const [editLocationState, editLocation] = useDialog();

  const { data, error } = useQuery(LocationDocument, {
    variables: { locationId },
  });
  const location = data?.location;
  const fundingAccount = location?.fundingAccount.value;

  return (
    <main className={classes.root}>
      <Helmet title={location?.name.value || undefined} />
      <Error error={error}>
        {{
          NotFound: 'Could not find location',
          Default: 'Error loading location',
        }}
      </Error>
      {!error && (
        <div className={classes.main}>
          <header className={classes.header}>
            <Typography
              variant="h2"
              className={cx(
                classes.name,
                location?.name ? null : classes.nameLoading
              )}
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
          </header>
          <div className={classes.subheader}>
            <Typography variant="h4">
              {location ? 'Location' : <Skeleton width={200} />}
            </Typography>
            {location && (
              <Typography variant="body2" color="textSecondary">
                Created <FormattedDateTime date={location.createdAt} />
              </Typography>
            )}
          </div>
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
          {location?.mapImage.value && (
            <StyledRemoteSvg
              url={location.mapImage.value.url}
              sx={(theme) => ({
                maxWidth: 400,
                '#Area': {
                  stroke: theme.palette.text.primary,
                },
                '#Selected_Location': {
                  fill: theme.palette.primary.main,
                },
                '#Highlight_Circle': {
                  fill: theme.palette.primary.light,
                },
              })}
            />
          )}
        </div>
      )}
      <EditLocation location={location} {...editLocationState} />
    </main>
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
