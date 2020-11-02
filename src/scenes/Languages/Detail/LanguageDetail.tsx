import { useMutation, useQuery } from '@apollo/client';
import { Grid, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Add, Edit } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { canEditAny } from '../../../api';
import { BooleanProperty } from '../../../components/BooleanProperty';
import { useDialog } from '../../../components/Dialog';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '../../../components/DisplaySimpleProperty';
import { Error } from '../../../components/Error';
import { Fab } from '../../../components/Fab';
import {
  useDateFormatter,
  useNumberFormatter,
} from '../../../components/Formatters';
import { LocationCard } from '../../../components/LocationCard';
import { ProjectListItemCard } from '../../../components/ProjectListItemCard';
import { Redacted } from '../../../components/Redacted';
import { Sensitivity } from '../../../components/Sensitivity';
import { CalendarDate, listOrPlaceholders } from '../../../util';
import { EditLanguage } from '../Edit';
import { AddLocationToLanguageForm } from '../Edit/AddLocationToLanguageForm';
import {
  LanguageDocument,
  LanguageProjectEngagement_LanguageEngagement_Fragment as LanguageFragment,
  RemoveLocationFromLanguageDocument,
} from './LanguageDetail.generated';
import { LeastOfThese } from './LeastOfThese';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    overflowY: 'auto',
    padding: spacing(4),
    '& > *:not(:last-child)': {
      marginBottom: spacing(3),
    },
  },
  name: {
    marginRight: spacing(4),
  },
  nameLoading: {
    width: '60%',
  },
  header: {
    flex: 1,
    display: 'flex',
  },
  listHeader: {
    marginBottom: spacing(1),
  },
  listItem: {
    marginBottom: spacing(2),
  },
  hidden: {
    visibility: 'hidden',
  },
}));

export const LanguageDetail = () => {
  const classes = useStyles();
  const { languageId } = useParams();
  const { data, error } = useQuery(LanguageDocument, {
    variables: { languageId },
  });

  const [editState, edit] = useDialog();
  const [locationFormState, addLocation] = useDialog();

  const language = data?.language;
  const {
    ethnologue,
    locations,
    projects,
    signLanguageCode,
    isSignLanguage,
    sensitivity,
    isDialect,
    displayNamePronunciation,
    registryOfDialectsCode,
    population,
    sponsorStartDate,
    sponsorEstimatedEndDate,
    displayName,
    name,
    hasExternalFirstScripture,
  } = language ?? {};

  // If the API is working properly, there should be a maximum of 1
  const firstScriptureEngagement = projects?.items
    .flatMap((project) => project.engagements.items)
    .filter(
      (engagement): engagement is LanguageFragment =>
        engagement.__typename === 'LanguageEngagement'
    )
    .find(
      (engagement) =>
        engagement.firstScripture.value &&
        engagement.language.value?.id === languageId
    );

  const firstScripture = {
    value: firstScriptureEngagement?.firstScripture.value,
    canRead: firstScriptureEngagement?.firstScripture.canRead,
  };

  const hasFirstScripture = {
    value: firstScripture.value ?? hasExternalFirstScripture?.value,
    canRead: !!firstScripture.canRead || !!hasExternalFirstScripture?.canRead,
  };

  const canEditAnyFields = canEditAny(language) || canEditAny(ethnologue);

  const formatDate = useDateFormatter();
  const formatNumber = useNumberFormatter();

  const [removeLocation, { loading: removing }] = useMutation(
    RemoveLocationFromLanguageDocument
  );

  return (
    <main className={classes.root}>
      <Helmet title={displayName?.value || name?.value || undefined} />
      <Error error={error}>
        {{
          NotFound: 'Could not find language',
          Default: 'Error loading language',
        }}
      </Error>
      {!error && (
        <>
          <div className={classes.header}>
            <Typography
              variant="h2"
              className={clsx(
                classes.name,
                displayName || name ? null : classes.nameLoading
              )}
            >
              {!language ? (
                <Skeleton width="100%" />
              ) : (
                (displayName?.value || name?.value) ?? (
                  <Redacted
                    info="You don't have permission to view this language's name"
                    width="100%"
                  />
                )
              )}
            </Typography>
            {canEditAnyFields ? (
              <Tooltip title="Edit Language">
                <Fab color="primary" aria-label="edit language" onClick={edit}>
                  <Edit />
                </Fab>
              </Tooltip>
            ) : null}
          </div>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Sensitivity value={sensitivity} loading={!language} />
            </Grid>
            <BooleanProperty
              label="Dialect"
              redacted="You do not have permission to view whether the language is a dialect"
              data={isDialect}
              wrap={(node) => <Grid item>{node}</Grid>}
            />
            <LeastOfThese language={language} />
            <BooleanProperty
              label="Sign Language"
              redacted="You do not have permission to view whether the language is a sign language"
              data={isSignLanguage}
              wrap={(node) => <Grid item>{node}</Grid>}
            />
          </Grid>
          <DisplayProperty
            label="Pronunciation Guide"
            value={displayNamePronunciation?.value}
            loading={!language}
          />
          <DisplayProperty
            label="Ethnologue Name"
            value={ethnologue?.name.value}
            loading={!language}
          />
          {isSignLanguage?.value && signLanguageCode?.value ? (
            <DisplayProperty
              label="Sign Language Code"
              value={signLanguageCode.value}
              loading={!language}
            />
          ) : (
            <DisplayProperty
              label="Ethnologue Code"
              value={ethnologue?.code.value}
              loading={!language}
            />
          )}
          <DisplayProperty
            label="Provisional Code"
            value={ethnologue?.provisionalCode.value}
            loading={!language}
          />
          <DisplayProperty
            label="Registry of Dialects Code"
            value={registryOfDialectsCode?.value}
            loading={!language}
          />
          <DisplayProperty
            label="Population"
            value={formatNumber(population?.value)}
            loading={!language}
          />
          <DisplayProperty
            label="Sponsor Start Date"
            value={formatDate(sponsorStartDate?.value)}
            loading={!language}
          />
          <DisplayProperty
            label="Sponsor Estimated End Fiscal Year"
            value={
              sponsorEstimatedEndDate?.value &&
              CalendarDate.toFiscalYear(sponsorEstimatedEndDate.value)
            }
            loading={!language}
          />

          <BooleanProperty
            label="First Scripture"
            redacted="You do not have permission to view whether the language has a first Scripture"
            data={hasFirstScripture}
            wrap={(node) => <Grid item>{node}</Grid>}
          />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid
                container
                spacing={2}
                alignItems="center"
                className={classes.listHeader}
              >
                <Grid item>
                  <Typography variant="h3">Locations</Typography>
                </Grid>
                <Grid item>
                  <Tooltip title="Add location">
                    <Fab
                      color="error"
                      aria-label="add location"
                      className={
                        locations?.canCreate === true
                          ? undefined
                          : classes.hidden
                      }
                      onClick={addLocation}
                    >
                      <Add />
                    </Fab>
                  </Tooltip>
                </Grid>
              </Grid>
              {listOrPlaceholders(locations?.items, 3).map(
                (location, index) => (
                  <LocationCard
                    key={location?.id ?? index}
                    location={location}
                    className={classes.listItem}
                    loading={!location}
                    removing={removing}
                    onRemove={() =>
                      language &&
                      location &&
                      removeLocation({
                        variables: {
                          languageId: language.id,
                          locationId: location.id,
                        },
                      })
                    }
                  />
                )
              )}
              {locations?.items.length === 0 ? (
                <Typography color="textSecondary">
                  This language does not have any locations yet
                </Typography>
              ) : locations?.canRead === false ? (
                <Typography color="textSecondary">
                  You don't have permission to see this language's locations
                </Typography>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h3" paragraph>
                Projects
              </Typography>
              {listOrPlaceholders(projects?.items, 3).map((project, index) => (
                <ProjectListItemCard
                  key={project?.id ?? index}
                  project={project}
                  className={classes.listItem}
                />
              ))}
              {projects?.items.length === 0 ? (
                <Typography color="textSecondary">
                  This language is not engaged in any projects
                </Typography>
              ) : projects?.canRead === false ? (
                <Typography color="textSecondary">
                  You don't have permission to see the projects this language is
                  engaged in
                </Typography>
              ) : null}
            </Grid>
          </Grid>

          {language ? (
            <EditLanguage language={language} {...editState} />
          ) : null}
          {language ? (
            <AddLocationToLanguageForm
              languageId={language.id}
              {...locationFormState}
            />
          ) : null}
        </>
      )}
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
