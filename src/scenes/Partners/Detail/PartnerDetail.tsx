import { useQuery } from '@apollo/client';
import { IconButton, makeStyles, Typography } from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { Many } from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useDialog } from '../../../components/Dialog';
import { UserListItemCardPortrait } from '../../../components/UserListItemCard';
import { EditablePartnerField, EditPartner } from '../Edit';
import { PartnerDocument } from './PartnerDetail.generated';

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

  const { data, error } = useQuery(PartnerDocument, {
    variables: {
      input: partnerId,
    },
  });
  const partner = data?.partner;

  const [editPartnerState, editPartner, editField] = useDialog<
    Many<EditablePartnerField>
  >();

  return (
    <>
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
            </div>
            <Typography variant="h3">
              Point of Contact
              <IconButton
                color="primary"
                aria-label="edit partner"
                onClick={() => editPartner('pointOfContactId')}
              >
                <AddCircle />
              </IconButton>
            </Typography>
            <UserListItemCardPortrait
              user={partner?.pointOfContact.value ?? undefined}
            />
          </>
        )}
      </main>
      {partner ? (
        <EditPartner
          partner={partner}
          {...editPartnerState}
          editFields={editField}
        />
      ) : null}
    </>
  );
};
