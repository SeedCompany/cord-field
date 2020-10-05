import { makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import React from 'react';
import { useParams } from 'react-router-dom';
import { usePartnerQuery } from './PartnerDetail.generated';

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

export const PartnerDetail = () => {
  const classes = useStyles();
  const { partnerId } = useParams();

  const { data, error } = usePartnerQuery({
    variables: {
      input: partnerId,
    },
  });
  const partner = data?.partner;

  //   const [editPartnerState, editPartner] = useDialog();

  return (
    <main className={classes.root}>
      {error ? (
        <Typography variant="h4">Error fetching partner</Typography>
      ) : (
        <>
          <div className={classes.header}>
            <Typography
              variant="h2"
              className={clsx(
                classes.name,
                partner ? null : classes.nameLoading
              )}
            >
              {partner ? (
                partner.organization.value?.name.value
              ) : (
                <Skeleton width="75%" />
              )}
            </Typography>
            {/* {partner ? (
              <IconButton
                color="primary"
                aria-label="edit partner"
                onClick={editPartner}
              >
                <PencilCircledIcon />
              </IconButton>
            ) : null} */}
          </div>
          {/* {partner ? (
            <EditPartner partner={partner} {...editPartnerState} />
          ) : null} */}
        </>
      )}
    </main>
  );
};
