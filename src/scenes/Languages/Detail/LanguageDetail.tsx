import { useMutation, useQuery } from '@apollo/client';
import { Add, Edit } from '@mui/icons-material';
import { Grid, Skeleton, Tooltip, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { PartialDeep } from 'type-fest';
import { removeItemFromList } from '~/api';
import { asDate, canEditAny, listOrPlaceholders } from '~/common';
import { ToggleCommentsButton } from '~/components/Comments/ToggleCommentButton';
import { BooleanProperty } from '../../../components/BooleanProperty';
import { useComments } from '../../../components/Comments/CommentsContext';
import { useDialog } from '../../../components/Dialog';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '../../../components/DisplaySimpleProperty';
import { Error } from '../../../components/Error';
import { Fab } from '../../../components/Fab';
import {
  FormattedDate,
  useNumberFormatter,
} from '../../../components/Formatters';
import { IconButton } from '../../../components/IconButton';
import { LocationCard } from '../../../components/LocationCard';
import { ProjectListItemCard } from '../../../components/ProjectListItemCard';
import { ProjectListItemFragment } from '../../../components/ProjectListItemCard/ProjectListItem.graphql';
import { Redacted } from '../../../components/Redacted';
import { Sensitivity } from '../../../components/Sensitivity';
import { TogglePinButton } from '../../../components/TogglePinButton';
import { EditLanguage } from '../Edit';
import { AddLocationToLanguageForm } from '../Edit/AddLocationToLanguageForm';
import { LanguagesQueryVariables } from '../List/languages.graphql';
import { FirstScripture } from './FirstScripture';
import {
  LanguageDocument,
  RemoveLocationFromLanguageDocument,
} from './LanguageDetail.graphql';
import { LanguagePostList } from './LanguagePostList';
import { LeastOfThese } from './LeastOfThese';

const useStyles = makeStyles()(({ spacing }) => ({
  root: {
    overflowY: 'auto',
    padding: spacing(4),
    '& > *:not(:last-child)': {
      marginBottom: spacing(3),
    },
  },
  header: {
    flex: 1,
    display: 'flex',
    gap: spacing(1),
  },
  name: {
    marginRight: spacing(2), // a little extra between text and buttons
    lineHeight: 'inherit', // centers text with buttons better
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
  const { classes } = useStyles();
  const { languageId = '' } = useParams();
  const { data, error } = useQuery(LanguageDocument, {
    variables: { languageId },
  });
  useComments(languageId);

  const [editState, edit] = useDialog();
  const [locationFormState, addLocation] = useDialog();

  const language = data?.language;
  const {
    id,
    ethnologue,
    locations,
    projects,
    signLanguageCode,
    isSignLanguage,
    sensitivity,
    isDialect,
    displayNamePronunciation,
    registryOfLanguageVarietiesCode,
    population,
    sponsorStartDate,
    sponsorEstimatedEndDate,
    displayName,
    name,
  } = language ?? {};

  const canEditAnyFields = canEditAny(language) || canEditAny(ethnologue);

  const formatNumber = useNumberFormatter();

  const [removeLocation, { loading: removing }] = useMutation(
    RemoveLocationFromLanguageDocument
  );

  return (
    <main className={classes.root}>
      <Helmet title={name?.value ?? displayName?.value ?? undefined} />
      <Error error={error}>
        {{
          NotFound: 'Could not find language',
          Default: 'Error loading language',
        }}
      </Error>
      {!error && (
        <>
          <div className={classes.header}>
            <Typography variant="h2" className={classes.name}>
              {!language ? (
                <Skeleton width="16ch" />
              ) : (
                name?.value ??
                displayName?.value ?? (
                  <Redacted
                    info="You don't have permission to view this language's name"
                    width="16ch"
                  />
                )
              )}
            </Typography>
            {canEditAnyFields ? (
              <Tooltip title="Edit Language">
                <IconButton aria-label="edit language" onClick={edit}>
                  <Edit />
                </IconButton>
              </Tooltip>
            ) : null}
            <TogglePinButton
              object={language}
              label="Language"
              listId="languages"
              listFilter={(args: PartialDeep<LanguagesQueryVariables>) =>
                args.input?.filter?.pinned ?? false
              }
            />
            <ToggleCommentsButton loading={!language} />
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
          <Grid direction="row" container spacing={2} alignItems="center">
            <BooleanProperty
              label="Reporting Language"
              redacted="You do not have permission to view whether the language is a reporting language"
              data={language?.isAvailableForReporting}
              wrap={(node) => <Grid item>{node}</Grid>}
            />
          </Grid>
          <DisplayProperty label="ID" value={id} loading={!language} />
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
            label="Registry of Language Varieties (ROLV) Code"
            value={registryOfLanguageVarietiesCode?.value}
            loading={!language}
          />
          <DisplayProperty
            label="Population"
            value={formatNumber(population?.value)}
            loading={!language}
          />
          <DisplayProperty
            label="Ethnologue Population"
            value={formatNumber(ethnologue?.population.value)}
            loading={!language}
          />
          <DisplayProperty
            label="Sponsor Start Date"
            value={<FormattedDate date={sponsorStartDate?.value} />}
            loading={!language}
          />
          <DisplayProperty
            label="Sponsor Estimated End Fiscal Year"
            value={asDate(sponsorEstimatedEndDate?.value)?.fiscalYear}
            loading={!language}
          />

          <Grid item>
            <FirstScripture data={data?.language} />
          </Grid>

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
                      void removeLocation({
                        variables: {
                          languageId: language.id,
                          locationId: location.id,
                        },
                        update: removeItemFromList({
                          listId: [language, 'locations'],
                          item: location,
                        }),
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
              {listOrPlaceholders(
                projects?.items as ProjectListItemFragment[] | undefined,
                3
              ).map((project, index) => (
                <ProjectListItemCard
                  key={project?.id ?? index}
                  project={project}
                  className={classes.listItem}
                />
              ))}
              {projects?.canRead === false ? (
                <Typography color="textSecondary">
                  You don't have permission to see the projects this language is
                  engaged in
                </Typography>
              ) : projects?.items.length === 0 ? (
                <Typography color="textSecondary">
                  This language is not engaged in any projects
                </Typography>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              {!!language && <LanguagePostList language={language} />}
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
