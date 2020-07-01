import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  Hearing,
  MenuBook,
  PlayCircleFilled,
  Translate,
} from '@material-ui/icons';
import React, { FC } from 'react';
import { displayMethodology, methodologyGroups } from '../../api';
import { MethodologyCardFragment } from './MethodologiesCard.generated';

const useStyles = makeStyles(({ spacing, palette }) => ({
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    height: spacing(16),
    padding: spacing(3, 4),
    borderBottom: `0.5px solid ${palette.divider}`,
  },
  methodologyChipContainer: {
    //TODO: decide how to fix the display
    '& > *': {
      display: 'inline',
    },
  },
  groupChip: {
    alignItems: 'center',
    marginTop: spacing(2),
    marginRight: spacing(1),
    '& > *': {
      marginRight: spacing(1),
    },
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: spacing(2),
  },
}));

export type PartnershipCardProps = {
  onEdit: () => void;
  className?: string;
} & MethodologyCardFragment;

export const MethodologiesCard: FC<PartnershipCardProps> = ({
  methodologies: { canEdit, value },
  onEdit,
  className,
}) => {
  const classes = useStyles();

  const methodologyListChips = value
    //TODO: decide how to show overflow
    // .slice(0, 2)
    .map((methodologyVal) => {
      const group = methodologyGroups[methodologyVal];
      const groupIcon =
        group === 'Written' ? (
          <MenuBook color="inherit" />
        ) : group === 'Oral Translation' ? (
          <Translate color="inherit" />
        ) : group === 'Oral Stories' ? (
          <Hearing color="inherit" />
        ) : group === 'Visual' ? (
          <PlayCircleFilled color="inherit" />
        ) : null;
      return (
        <Typography
          key={methodologyVal}
          className={classes.groupChip}
          color="textSecondary"
        >
          {groupIcon}
          {displayMethodology(methodologyVal)}
        </Typography>
      );
    });

  return (
    <Card className={className}>
      <CardContent className={classes.cardContent}>
        <Typography variant="h4">Methodologies</Typography>
        <div className={classes.methodologyChipContainer}>
          {methodologyListChips}
        </div>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button color="primary" disabled={!canEdit} onClick={onEdit}>
          Edit Methodologies
        </Button>
        {/* TODO: add update time when modifiedAt is fixed
        <DisplaySimpleProperty
          label="updated"
          value={formatdateTime(updateTime)}
          ValueProps={{ color: 'textSecondary' }}
        /> */}
      </CardActions>
    </Card>
  );
};
