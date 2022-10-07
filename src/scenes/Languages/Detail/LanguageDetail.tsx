import { useMutation, useQuery } from '@apollo/client';
import { Add, Edit } from '@mui/icons-material';
import { Box, Grid, Skeleton, Tooltip, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PartialDeep } from 'type-fest';
import { removeItemFromList } from '~/api';
import { canEditAny, listOrPlaceholders } from '~/common';
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
import { IconButton } from '../../../components/IconButton';
import { PresetInventoryIconFilled } from '../../../components/Icons';
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

export const LanguageDetail = () => {
  const { languageId = '' } = useParams();
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
  } = language ?? {};

  const canEditAnyFields = canEditAny(language) || canEditAny(ethnologue);

  const formatDate = useDateFormatter();
  const formatNumber = useNumberFormatter();

  const [removeLocation, { loading: removing }] = useMutation(
    RemoveLocationFromLanguageDocument
  );

  return (
    <Box
      component="main"
      sx={(theme) => ({
        overflowY: 'auto',
        padding: theme.spacing(4),
        '& > *:not(:last-child)': {
          marginBottom: theme.spacing(3),
        },
      })}
    >
      <Helmet title={displayName?.value || name?.value || undefined} />
      <Error error={error}>
        {{
          NotFound: 'Could not find language',
          Default: 'Error loading language',
        }}
      </Error>
      {!error && (
        <>
          <Box
            sx={(theme) => ({
              flex: 1,
              display: 'flex',
              gap: theme.spacing(1),
            })}
          >
            <Typography
              variant="h2"
              sx={(theme) => ({
                marginRight: theme.spacing(2), // a little extra between text and buttons
                lineHeight: 'inherit', // centers text with buttons better
              })}
            >
              {!language ? (
                <Skeleton width="16ch" />
              ) : (
                (displayName?.value || name?.value) ?? (
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
          </Box>
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
            {language?.presetInventory.value && (
              <Grid item>
                <Tooltip title="Preset Inventory: Exposed to major investors to directly fund">
                  <PresetInventoryIconFilled
                    fontSize="large"
                    sx={(theme) => ({
                      display: 'flex',
                      alignItems: 'center',
                      color: theme.palette.info.main,
                    })}
                  />
                </Tooltip>
              </Grid>
            )}
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
            value={sponsorEstimatedEndDate?.value?.fiscalYear}
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
                sx={(theme) => ({
                  marginBottom: theme.spacing(1),
                })}
              >
                <Grid item>
                  <Typography variant="h3">Locations</Typography>
                </Grid>
                <Grid item>
                  <Tooltip title="Add location">
                    <Fab
                      color="error"
                      aria-label="add location"
                      sx={
                        locations?.canCreate === true
                          ? undefined
                          : {
                              visibility: 'hidden',
                            }
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
                    sx={(theme) => ({
                      marginBottom: theme.spacing(2),
                    })}
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
                  sx={(theme) => ({
                    marginBottom: theme.spacing(2),
                  })}
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
