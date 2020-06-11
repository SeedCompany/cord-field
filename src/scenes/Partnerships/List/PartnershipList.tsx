import {
  Breadcrumbs,
  fade,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { PartnershipCard } from '../../../components/PartnershipCard';
import { listOrPlaceholders } from '../../../util';
import { useProjectPartnershipsQuery } from './PartnershipList.generated';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(4),
    marginBottom: spacing(2),
  },

  breadcrumbs: {
    margin: spacing(3, 0),
  },
  headerContainer: {
    margin: spacing(3, 0),
    width: 600,
    display: 'flex',
    justifyContent: 'space-between',
  },
  item: {
    marginBottom: spacing(2),
  },
  addButton: {
    backgroundColor: palette.error.main,
    color: palette.common.white,
    '&:hover': {
      backgroundColor: fade(palette.error.main, 0.5),
    },
  },
  addPartner: {
    marginBottom: spacing(2),
    display: 'flex',
    alignItems: 'center',
    '& button': {
      marginRight: spacing(1),
    },
  },
}));

export const PartnershipList: FC = () => {
  const classes = useStyles();

  const { projectId } = useParams();
  const { data } = useProjectPartnershipsQuery({
    variables: { input: projectId },
  });

  const items = data?.project.partnerships.items;
  const canCreate = data?.project.partnerships.canCreate;

  return (
    <div className={classes.root}>
      <Breadcrumbs className={classes.breadcrumbs}>
        <Breadcrumb to="/projects">Projects</Breadcrumb>
        {data?.project.name?.value && (
          <Breadcrumb to={`/projects/${projectId}`}>
            {data?.project.name?.value}
          </Breadcrumb>
        )}
      </Breadcrumbs>
      <div className={classes.headerContainer}>
        <Typography variant="h2" paragraph>
          Partners
        </Typography>
        {canCreate && (
          <Typography color="primary" className={classes.addPartner}>
            <IconButton
              classes={{ root: classes.addButton }}
              aria-label="add button"
              color="primary"
              disableRipple
              size="small"
            >
              <Add />
            </IconButton>
            Add Partnership
          </Typography>
        )}
      </div>
      {listOrPlaceholders(items, 15).map((item, index) => (
        <PartnershipCard
          key={item?.id ?? index}
          partnership={item}
          className={classes.item}
        />
      ))}
    </div>
  );
};
