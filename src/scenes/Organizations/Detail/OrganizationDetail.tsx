import {
  Breadcrumbs,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { useDialog } from '../../../components/Dialog';
import { PencilCircledIcon } from '../../../components/Icons';
import { EditOrganization } from '../Edit';
import { useOrganizationQuery } from './OrganizationDetail.generated';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(4),
    '& > *': {
      marginBottom: spacing(3),
    },
  },
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    '& > *': {
      marginRight: spacing(2),
    },
  },
  iconSpacing: {
    marginRight: spacing(1),
  },
  iconButtonRoot: {
    padding: 0,
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

  const [editOrgState, editOrg] = useDialog();

  return (
    <div className={classes.root}>
      {error ? (
        <Typography variant="h4">Error fetching partner</Typography>
      ) : (
        <>
          <Breadcrumbs>
            <Breadcrumb to="/organizations">Partners</Breadcrumb>
          </Breadcrumbs>
          <header className={classes.header}>
            <Typography variant="h2">
              {data?.organization.name.value}
            </Typography>
            <Typography
              variant="body2"
              color="primary"
              className={classes.container}
            >
              <IconButton
                classes={{ root: classes.iconButtonRoot }}
                className={classes.iconSpacing}
                color="primary"
                aria-label="edit partner"
                onClick={editOrg}
              >
                <PencilCircledIcon />
              </IconButton>
              Edit
            </Typography>
          </header>
          <EditOrganization {...editOrgState} orgId={orgId} />
        </>
      )}
    </div>
  );
};
