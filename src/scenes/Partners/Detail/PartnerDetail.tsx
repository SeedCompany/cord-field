import { useQuery } from '@apollo/client';
import {
  Button,
  CardActionArea,
  CardContent,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Add, Edit } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { Many } from 'lodash';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Avatar } from '../../../components/Avatar';
import { BooleanProperty } from '../../../components/BooleanProperty';
import { DataButton } from '../../../components/DataButton';
import { useDialog } from '../../../components/Dialog';
import { Fab } from '../../../components/Fab';
import { useDateTimeFormatter } from '../../../components/Formatters';
import { UserListItemCardPortrait } from '../../../components/UserListItemCard';
import { square } from '../../../util';
import { EditablePartnerField, EditPartner } from '../Edit';
import { AddressCard } from './AddressCard';
import { PartnerDocument } from './PartnerDetail.generated';
import { PartnerTypesCard } from './PartnerTypesCard';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
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
  pocCardActionArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  pocCardAvatar: {
    ...square(86),
    fontSize: 70,
    color: palette.background.paper,
    backgroundColor: palette.background.default,
  },
}));

export const PartnerDetail = () => {
  const classes = useStyles();
  const { partnerId } = useParams();
  const formatDateTime = useDateTimeFormatter();

  const { data, error } = useQuery(PartnerDocument, {
    variables: {
      input: partnerId,
    },
  });
  const partner = data?.partner;
  const name = partner?.organization.value?.name.value;

  const [editPartnerState, editPartner, editField] = useDialog<
    Many<EditablePartnerField>
  >();

  return (
    <main className={classes.root}>
      <Helmet title={name ?? undefined} />
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
            {partner && (
              <Tooltip title="Update Global Innovations Client">
                <Fab
                  color="primary"
                  aria-label="Update Global Innovations Client"
                  onClick={() => editPartner('globalInnovationsClient')}
                >
                  <Edit />
                </Fab>
              </Tooltip>
            )}
          </header>
          <div className={classes.subheader}>
            <Typography variant="h4">
              {partner ? 'Partner Information' : <Skeleton width={200} />}
            </Typography>
            {partner && (
              <Typography variant="body2" color="textSecondary">
                Created {formatDateTime(partner.createdAt)}
              </Typography>
            )}
          </div>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <DataButton
                onClick={() => editPartner('active')}
                secured={partner?.active}
                redacted="You do not have permission to view Status"
                children={partner?.active.value ? 'Active' : 'Inactive'}
                loading={!partner}
                empty={'Enter Status'}
              />
            </Grid>
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
                loading={!partner}
              />
            </Grid>
            <BooleanProperty
              label="Global Innovations Client"
              redacted="You do not have permission to view whether this is a Global Innovations Client"
              data={partner?.globalInnovationsClient}
              wrap={(node) => <Grid item>{node}</Grid>}
            />
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={6} className={classes.cardSection}>
              <Typography variant="h3">
                {partner ? 'Partner Types' : <Skeleton width="120px" />}
              </Typography>
              <PartnerTypesCard
                partner={partner}
                onEdit={() => editPartner(['types', 'financialReportingTypes'])}
                className={classes.card}
              />
            </Grid>
            <Grid item xs={6} className={classes.cardSection}>
              <Typography variant="h3">
                {partner ? 'Address' : <Skeleton width="120px" />}
              </Typography>
              <AddressCard
                partner={partner}
                onEdit={() => editPartner('address')}
                className={classes.card}
              />
            </Grid>
          </Grid>
          <div className={classes.sectionTitle}>
            <Typography variant="h3">
              {partner ? 'Point of Contact' : <Skeleton width="120px" />}
            </Typography>
          </div>
          <UserListItemCardPortrait
            user={partner?.pointOfContact.value || undefined}
            content={
              !partner?.pointOfContact.value ? (
                <CardActionArea
                  onClick={() => editPartner('pointOfContactId')}
                  className={classes.pocCardActionArea}
                  aria-label="add mentor"
                >
                  <CardContent>
                    <Avatar className={classes.pocCardAvatar}>
                      <Add fontSize="inherit" />
                    </Avatar>
                  </CardContent>
                </CardActionArea>
              ) : undefined
            }
            action={
              <Button
                color="primary"
                disabled={
                  !partner?.pointOfContact || !partner.pointOfContact.canEdit
                }
                onClick={() => editPartner('pointOfContactId')}
              >
                {partner?.pointOfContact.value ? 'Edit' : 'Add'} Point of
                Contact
              </Button>
            }
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
