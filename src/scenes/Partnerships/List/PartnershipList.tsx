import {
  Breadcrumbs,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { PartnershipCard } from '../../../components/PartnershipCard';
import { listOrPlaceholders } from '../../../util';
import { useProjectPartnershipsQuery } from './PartnershipList.generated';

const useStyles = makeStyles(({ spacing, palette, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(4),
    maxWidth: breakpoints.values.sm,
  },
  headerContainer: {
    margin: spacing(3, 0),
    display: 'flex',
    justifyContent: 'space-between',
  },
  addPartner: {
    display: 'flex',
    alignItems: 'center',
    '& button': {
      marginRight: spacing(2),
    },
  },
  addButton: {
    backgroundColor: palette.error.main,
    color: palette.error.contrastText,
    '&:hover': {
      backgroundColor: palette.error.dark,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: palette.error.main,
      },
    },
  },
  item: {
    marginBottom: spacing(2),
  },
}));

export const PartnershipList: FC = () => {
  const classes = useStyles();

  const { projectId } = useParams();
  const { data } = useProjectPartnershipsQuery({
    variables: { input: projectId },
  });
  const project = data?.project;
  const partnerships = project?.partnerships;

  return (
    <div className={classes.root}>
      <Breadcrumbs>
        <Breadcrumb to={`/projects/${projectId}`}>
          {project?.name?.value ?? <Skeleton width={200} />}
        </Breadcrumb>
        <Breadcrumb to={`/projects/${projectId}/partnerships`}>
          Partnerships
        </Breadcrumb>
      </Breadcrumbs>
      <div className={classes.headerContainer}>
        <Typography variant="h2">Partnerships</Typography>
        {partnerships?.canCreate && (
          <Typography color="primary" className={classes.addPartner}>
            <IconButton
              classes={{ root: classes.addButton }}
              aria-label="add button"
              size="small"
            >
              <Add fontSize="large" />
            </IconButton>
            Add Partnership
          </Typography>
        )}
      </div>
      {listOrPlaceholders(partnerships?.items, 5).map((item, index) => (
        <PartnershipCard
          key={item?.id ?? index}
          partnership={item}
          className={classes.item}
        />
      ))}
    </div>
  );
};
