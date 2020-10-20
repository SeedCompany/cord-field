import { useQuery } from '@apollo/client';
import {
  Grid,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { Many } from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import { BooleanProperty } from '../../../components/BooleanProperty';
import { DataButton } from '../../../components/DataButton';
import { useDialog } from '../../../components/Dialog';
import { Fab } from '../../../components/Fab';
import { useDateFormatter } from '../../../components/Formatters';
import { PencilCircledIcon } from '../../../components/Icons';
import { UserListItemCardPortrait } from '../../../components/UserListItemCard';
import { EditablePartnerField, EditPartner } from '../Edit';
import { AddressCard } from './AddressCard';
import { PartnerDocument } from './PartnerDetail.generated';
import { PartnerTypeCard } from './PartnerTypesCard';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing(4),
  },
  main: {
    maxWidth: breakpoints.values.md,
    '& > *': {
      marginBottom: spacing(3),
    },
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
  subheader: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginRight: spacing(2),
    },
  },
  cardSection: {
    '& > h3': {
      marginBottom: spacing(1),
    },
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: spacing(1),
    '& > *': {
      marginRight: spacing(2),
    },
  },
}));

export const PartnerDetail = () => {
  const classes = useStyles();
  const { partnerId } = useParams();
  const formatDate = useDateFormatter();

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
    <main className={classes.root}>
      {error ? (
        <Typography variant="h4">Error fetching partner</Typography>
      ) : (
        <div className={classes.main}>
          <header className={classes.header}>
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
            <Tooltip title="Update Global Innovations Client">
              <IconButton
                color="primary"
                aria-label="edit partner"
                onClick={() => editPartner('globalInnovationsClient')}
              >
                <PencilCircledIcon />
              </IconButton>
            </Tooltip>
          </header>
          <div className={classes.subheader}>
            <Typography variant="h4">
              {partner ? 'Partner Information' : <Skeleton width={200} />}
            </Typography>
            {partner && (
              <Typography variant="body2" color="textSecondary">
                Created {formatDate(partner.createdAt)}
              </Typography>
            )}
          </div>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <DataButton
                onClick={() => editPartner('pmcEntityCode')}
                secured={partner?.pmcEntityCode}
                redacted="You do not have permission to view PMC Entity Code"
                children={
                  partner?.pmcEntityCode.value &&
                  `PMC Entity Code: ${partner.pmcEntityCode.value}`
                }
                empty={'Enter PMC Entity Code'}
              />
            </Grid>
            <Grid item>
              <DataButton
                onClick={() => editPartner('active')}
                secured={partner?.active}
                redacted="You do not have permission to view Status"
                children={partner?.active.value ? 'Active' : 'Inactive'}
              />
            </Grid>
            <Grid item>
              <BooleanProperty
                label="Global Innovations Client"
                redacted="You do not have permission to view whether this is a Global Innovations Client"
                data={partner?.globalInnovationsClient}
                wrap={(node) => <Grid item>{node}</Grid>}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={6} className={classes.cardSection}>
              <Typography variant="h3">Partner Types</Typography>
              <PartnerTypeCard
                partner={partner}
                onEdit={() => editPartner(['types', 'financialReportingTypes'])}
                className={classes.card}
              />
            </Grid>
            <Grid item xs={6} className={classes.cardSection}>
              <Typography variant="h3">Address</Typography>
              <AddressCard
                partner={partner}
                onEdit={() => editPartner('address')}
                className={classes.card}
              />
            </Grid>
          </Grid>
          <div className={classes.sectionTitle}>
            <Typography variant="h3">Point of Contact</Typography>
            <Tooltip title="Edit Point Of Contact">
              <Fab
                color="primary"
                aria-label="edit partner"
                onClick={() => editPartner('pointOfContactId')}
              >
                <Add />
              </Fab>
            </Tooltip>
          </div>
          <UserListItemCardPortrait
            user={partner?.pointOfContact.value ?? undefined}
          />
        </div>
      )}
      {partner ? (
        <EditPartner
          partner={partner}
          {...editPartnerState}
          editFields={editField}
        />
      ) : null}
    </main>
  );
};
