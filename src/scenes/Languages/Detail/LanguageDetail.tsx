import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import React from 'react';
import { useParams } from 'react-router';
import { isSecured } from '../../../api';
import { useDialog } from '../../../components/Dialog';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '../../../components/DisplaySimpleProperty';
import { Fab } from '../../../components/Fab';
import { useDateTimeFormatter } from '../../../components/Formatters';
import { ProjectListItemCard } from '../../../components/ProjectListItemCard';
import { Redacted } from '../../../components/Redacted';
import { EditLanguage } from '../Edit';
import { useLanguageQuery } from './LanguageDetail.generated';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    overflowY: 'scroll',
    padding: spacing(4),
    '& > *:not(:last-child)': {
      marginBottom: spacing(3),
    },
    maxWidth: breakpoints.values.md,
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
}));

export const LanguageDetail = () => {
  const classes = useStyles();
  const { languageId } = useParams();
  const { data, error } = useLanguageQuery({
    variables: { languageId },
  });

  const [editLanguageDialogState, openEditLanguageDialog] = useDialog();

  const language = data?.language;

  const canEditAnyFields = !language
    ? false
    : Object.values(language).some((value) =>
        isSecured(value) ? value.canEdit : false
      ) &&
      Object.values(language.ethnologue).some((value) =>
        isSecured(value) ? value.canEdit : false
      );

  const dateTimeFormatter = useDateTimeFormatter();

  return (
    <main className={classes.root}>
      {error ? (
        <Typography variant="h4">Error loading Language</Typography>
      ) : (
        <>
          <div className={classes.header}>
            <Typography
              variant="h2"
              className={clsx(
                classes.name,
                language?.displayName || language?.name
                  ? null
                  : classes.nameLoading
              )}
            >
              {!language ? (
                <Skeleton width="100%" />
              ) : (
                (language.displayName.value || language.name.value) ?? (
                  <Redacted
                    info="You don't have permission to view this person's name"
                    width="100%"
                  />
                )
              )}
            </Typography>
            {canEditAnyFields ? (
              <Fab
                color="primary"
                aria-label="edit person"
                onClick={openEditLanguageDialog}
              >
                <Edit />
              </Fab>
            ) : null}
          </div>
          <DisplayProperty
            label="Created At"
            value={dateTimeFormatter(language?.createdAt)}
            loading={!language}
          />
          <DisplayProperty
            label="Pronounciation"
            value={language?.displayNamePronunciation.value}
            loading={!language}
          />
          <DisplayProperty
            label="Is Dialect"
            value={Boolean(language?.isDialect.value).toString()}
            loading={!language}
          />
          <DisplayProperty
            label="Ethnologue Code"
            value={language?.ethnologue.code.value}
            loading={!language}
          />
          <DisplayProperty
            label="Registry of Dialects Code"
            value={language?.registryOfDialectsCode.value}
            loading={!language}
          />
          <DisplayProperty
            label="Population"
            value={language?.population.value}
            loading={!language}
          />
          <DisplayProperty
            label="Sponsor Date"
            value={dateTimeFormatter(language?.sponsorDate.value)}
            loading={!language}
          />
          <DisplayProperty
            label="Sensitivity"
            value={language?.sensitivity}
            loading={!language}
          />
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="h4">
                Locations List goes here when ready
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4">
                Projects List goes here when ready
              </Typography>
              {language?.projects.items.map((project) => (
                <ProjectListItemCard project={project} />
              ))}
            </Grid>
          </Grid>

          {language ? (
            <EditLanguage language={language} {...editLanguageDialogState} />
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
