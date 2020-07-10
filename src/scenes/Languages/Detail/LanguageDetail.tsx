import { makeStyles, Typography } from '@material-ui/core';
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
import { Redacted } from '../../../components/Redacted';
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

  const [_editLanguageDialogState, openEditLanguageDialog] = useDialog();

  const language = data?.language;

  const canEditAnyFields = !language
    ? false
    : Object.values(language).some((value) =>
        isSecured(value) ? value.canEdit : false
      ) &&
      Object.values(language.ethnologue).some((value) =>
        isSecured(value) ? value.canEdit : false
      );

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
            label="Population"
            value={language?.population.value}
            loading={!language}
          />
          <DisplayProperty
            label="Registry of Dialects Code"
            value={language?.registryOfDialectsCode.value}
            loading={!language}
          />
          <DisplayProperty
            label="Ethnologue Code"
            value={language?.ethnologue.code.value}
            loading={!language}
          />

          {/* {language ? <EditUser user={user} {...editUserState} /> : null} */}
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
