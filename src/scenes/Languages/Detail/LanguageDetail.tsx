import { useQuery } from '@apollo/client';
import { Edit } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Grid, Skeleton, Tooltip, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PartialDeep } from 'type-fest';
import { canEditAny } from '~/common';
import { BooleanProperty } from '~/components/BooleanProperty';
import { ToggleCommentsButton } from '~/components/Comments/ToggleCommentButton';
import { Sensitivity } from '~/components/Sensitivity';
import { Tab, TabsContainer } from '~/components/Tabs';
import { EnumParam, makeQueryHandler, withDefault } from '~/hooks';
import { useComments } from '../../../components/Comments/CommentsContext';
import { useDialog } from '../../../components/Dialog';
import { Error } from '../../../components/Error';
import { IconButton } from '../../../components/IconButton';
import { Redacted } from '../../../components/Redacted';
import { TogglePinButton } from '../../../components/TogglePinButton';
import { EditLanguage } from '../Edit';
import { LanguagesQueryVariables } from '../List/languages.graphql';
import { LanguageDocument } from './LanguageDetail.graphql';
import { LeastOfThese } from './LeastOfThese';
import { LanguageDetailLocations } from './Tabs/Locations/LanguageDetailLocations';
import { LanguageDetailPosts } from './Tabs/Posts/LanguageDetailPosts';
import { LanguageDetailProfile } from './Tabs/Profile/LanguageDetailProfile';
import { LanguageDetailProjects } from './Tabs/Projects/LanguageDetailProjects';

const useLanguageDetailsFilters = makeQueryHandler({
  tab: withDefault(
    EnumParam(['profile', 'locations', 'projects', 'posts']),
    'profile'
  ),
});

export const LanguageDetail = () => {
  const { languageId = '' } = useParams();
  const [filters, setFilters] = useLanguageDetailsFilters();
  const { data, error } = useQuery(LanguageDocument, {
    variables: { languageId },
    fetchPolicy: 'cache-and-network',
  });
  useComments(languageId);

  const [editState, edit] = useDialog();

  const language = data?.language;
  const {
    ethnologue,
    displayName,
    name,
    sensitivity,
    isDialect,
    isSignLanguage,
  } = language ?? {};

  const canEditAnyFields = canEditAny(language) || canEditAny(ethnologue);
  const canReadLocations = language?.locations.canRead !== false;
  const canReadProjects = language?.projects.canRead !== false;
  const canReadPosts = language?.posts.canRead !== false;

  const readableTabs = [
    'profile',
    ...(canReadLocations ? ['locations'] : []),
    ...(canReadProjects ? ['projects'] : []),
    ...(canReadPosts ? ['posts'] : []),
  ];

  useEffect(() => {
    if (!readableTabs.includes(filters.tab)) {
      setFilters({ tab: 'profile' });
    }
  }, [filters.tab, readableTabs, setFilters]);

  return (
    <Box
      component="main"
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflowY: 'auto',
        padding: 4,
        gap: 3,
        maxWidth: theme.breakpoints.values.xl,
      })}
    >
      <Helmet title={name?.value ?? displayName?.value ?? undefined} />
      <Error error={error}>
        {{
          NotFound: 'Could not find language',
          Default: 'Error loading language',
        }}
      </Error>
      {!error && (
        <>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="h2" sx={{ mr: 2, lineHeight: 'inherit' }}>
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
          </Grid>
          <TabsContainer>
            <TabContext
              value={
                readableTabs.includes(filters.tab) ? filters.tab : 'profile'
              }
            >
              <TabList onChange={(_, next) => setFilters({ tab: next })}>
                <Tab label="Profile" value="profile" />
                {canReadLocations && (
                  <Tab label="Locations" value="locations" />
                )}
                {canReadProjects && <Tab label="Projects" value="projects" />}
                {canReadPosts && <Tab label="Posts" value="posts" />}
              </TabList>
              <TabPanel value="profile">
                <LanguageDetailProfile language={language} />
              </TabPanel>
              {canReadLocations && (
                <TabPanel value="locations">
                  {language && <LanguageDetailLocations language={language} />}
                </TabPanel>
              )}
              {canReadProjects && (
                <TabPanel value="projects">
                  <LanguageDetailProjects />
                </TabPanel>
              )}
              {canReadPosts && (
                <TabPanel value="posts">
                  {language && <LanguageDetailPosts language={language} />}
                </TabPanel>
              )}
            </TabContext>
          </TabsContainer>

          {language ? (
            <EditLanguage language={language} {...editState} />
          ) : null}
        </>
      )}
    </Box>
  );
};
