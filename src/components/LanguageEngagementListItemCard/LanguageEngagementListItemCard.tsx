import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { FC } from 'react';
import * as React from 'react';
import { displayEngagementStatus } from '../../api/displayStatus';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { useDateFormatter, useNumberFormatter } from '../Formatters';
import { PencilCircledIcon, ScriptIcon } from '../Icons';
import { Picture, useRandomPicture } from '../Picture';
import { CardActionAreaLink } from '../Routing';
import { LanguageEngagementListItemFragment } from './LanguageEngagementListItem.generated';

const useStyles = makeStyles(({ spacing }) => {
  const cardWidth = 666;
  return {
    root: {
      width: '100%',
      maxWidth: cardWidth,
      maxHeight: 231,
    },
    card: {
      display: 'flex',
      alignItems: 'initial',
    },
    media: {
      width: cardWidth / 3,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    cardContent: {
      flex: 1,
      padding: spacing(2, 3),
      display: 'flex',
      justifyContent: 'space-between',
    },
    leftContent: {
      flex: 1,
    },
    rightContent: {
      flex: 1,
      textAlign: 'right',
      marginLeft: spacing(2),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    productList: {
      padding: 0,
      margin: spacing(0, 0, 1),
    },
    centerItems: {
      display: 'flex',
      alignItems: 'center',
    },
    iconSpacing: {
      marginRight: spacing(1),
    },
  };
});

export type LanguageEngagementListItemCardProps = LanguageEngagementListItemFragment & {
  className?: string;
};

export const LanguageEngagementListItemCard: FC<LanguageEngagementListItemCardProps> = (
  props
) => {
  const numberFormatter = useNumberFormatter();
  const dateFormatter = useDateFormatter();
  const classes = useStyles();
  const pic = useRandomPicture({ seed: props.id, width: 300, height: 200 });

  const language = props.language.value;
  const name = language?.name.value ?? language?.displayName?.value;
  const population =
    language?.organizationPopulation?.value ??
    language?.ethnologuePopulation?.value;
  const rodNumber = language?.rodNumber?.value;
  const endDate = getEndDate(props);

  return (
    <Card className={clsx(classes.root, props.className)}>
      <CardActionAreaLink
        to={`/engagements/${props.id}`}
        className={classes.card}
      >
        <div className={classes.media}>
          <Picture fit="cover" {...pic} />
        </div>
        <CardContent className={classes.cardContent}>
          <Grid
            container
            direction="column"
            justify="space-between"
            spacing={1}
            className={classes.leftContent}
          >
            <Grid item>
              <Typography variant="h4">{name}</Typography>
            </Grid>
            {rodNumber ? (
              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  ROD: {rodNumber}
                </Typography>
              </Grid>
            ) : null}
            <Grid item>
              <DisplaySimpleProperty
                label="Status"
                value={displayEngagementStatus(props.status)}
              />
            </Grid>
            {props.products.total > 0 ? (
              <Grid item>
                <Typography variant="body2" gutterBottom>
                  Products:
                </Typography>
                <ul className={classes.productList}>
                  {props.products.items.map((product) => (
                    <Typography
                      component="li"
                      variant="body2"
                      color="textSecondary"
                      className={classes.centerItems}
                    >
                      {/* TODO Product naming & mapping to icons */}
                      <ScriptIcon className={classes.iconSpacing} />
                      {product.type}
                    </Typography>
                  ))}
                </ul>
              </Grid>
            ) : null}
            <Grid item>
              <Typography
                variant="body2"
                color="primary"
                className={classes.centerItems}
              >
                <PencilCircledIcon className={classes.iconSpacing} />
                Edit Info
              </Typography>
            </Grid>
          </Grid>
          <div className={classes.rightContent}>
            <DisplaySimpleProperty aria-hidden="true" />
            {population ? (
              <div>
                <Typography variant="h1">
                  {numberFormatter(population)}
                </Typography>
                <Typography variant="body2" color="primary">
                  Population
                </Typography>
              </div>
            ) : null}
            {endDate ? (
              <DisplaySimpleProperty
                label={endDate.label}
                value={dateFormatter(endDate.value)}
                ValueProps={{ color: 'primary' }}
              />
            ) : null}
          </div>
        </CardContent>
      </CardActionAreaLink>
    </Card>
  );
};

const getEndDate = (eng: LanguageEngagementListItemFragment) => {
  const terminal = eng.status !== 'InDevelopment' && eng.status !== 'Active';
  if (terminal && eng.completeDate.value) {
    return {
      label: displayEngagementStatus(eng.status) + ' Date',
      value: eng.completeDate.value,
    };
  }
  const endDate = eng.endDate.value;
  if (!endDate) {
    return null;
  }
  if (eng.status === 'InDevelopment') {
    return { label: 'End Date', value: endDate };
  }
  const revised = endDate !== eng.initialEndDate.value;
  return {
    label: `${revised ? 'Revised' : 'Initial'} End Date`,
    value: endDate,
  };
};
