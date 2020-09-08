import { IconButton, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useDialog } from '../../../components/Dialog';
import { PencilCircledIcon } from '../../../components/Icons';
import { EditOrganization } from '../Edit';
import { useOrganizationQuery } from './OrganizationDetail.generated';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing(4),
    maxWidth: breakpoints.values.md,
  },
  name: {
    // align text with edit button better
    // should probably fix another way
    marginTop: 3,
    marginRight: spacing(2),
  },
  nameLoading: {
    flex: 1,
  },
  header: {
    flex: 1,
    display: 'flex',
  },
}));

export const OrganizationDetail = () => {
  const classes = useStyles();
  const { orgId } = useParams();

  const { data, error } = useOrganizationQuery({
    variables: {
      input: orgId,
    },
  });
  const org = data?.organization;

  const [editOrgState, editOrg] = useDialog();

  return (
    <main className={classes.root}>
      {error ? (
        <Typography variant="h4">Error fetching partner</Typography>
      ) : (
        <>
          <div className={classes.header}>
            <Typography
              variant="h2"
              className={clsx(classes.name, org ? null : classes.nameLoading)}
            >
              {org ? org.name.value : <Skeleton width="75%" />}
            </Typography>
            {org ? (
              <IconButton
                color="primary"
                aria-label="edit partner"
                onClick={editOrg}
              >
                <PencilCircledIcon />
              </IconButton>
            ) : null}
          </div>
          {org ? <EditOrganization org={org} {...editOrgState} /> : null}
        </>
      )}
    </main>
  );
};
