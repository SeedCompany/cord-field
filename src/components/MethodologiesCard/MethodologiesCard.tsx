import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Hearing, MenuBook, Translate, Visibility } from '@material-ui/icons';
import React, { FC } from 'react';
import { methodologyGroups } from '../../api';
import { MethodologyCardFragment } from './MethodologiesCard.generated';

const useStyles = makeStyles(({ spacing, palette }) => ({
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    height: spacing(16),
    padding: spacing(3, 4),
    borderBottom: `0.5px solid ${palette.divider}`,
  },
  groupChip: {
    display: 'flex',
    alignItems: 'center',
    marginTop: spacing(2),
    marginRight: spacing(1),
    '& > *': {
      marginRight: spacing(0.5),
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
  //   const formatDateTime = useDateTimeFormatter();

  const methodologyListChips = value.map((methodologyVal) => {
    const group = methodologyGroups[methodologyVal];
    const groupIcon =
      group === 'Written' ? (
        <MenuBook color="inherit" />
      ) : group === 'Oral Translation' ? (
        <Translate color="inherit" />
      ) : group === 'Oral Stories' ? (
        <Hearing color="inherit" />
      ) : group === 'Visual' ? (
        <Visibility color="inherit" />
      ) : null;
    return (
      <Typography
        key={methodologyVal}
        className={classes.groupChip}
        color="textSecondary"
      >
        {groupIcon}
        {methodologyVal}
      </Typography>
    );
  });

  return (
    <Card className={className}>
      <CardContent className={classes.cardContent}>
        <Typography variant="h4">Methodologies</Typography>
        {methodologyListChips}
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
