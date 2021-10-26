import {
  Card,
  CardActions,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { FC } from 'react';
import * as React from 'react';
import { displayEngagementStatus } from '../../api';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { useNumberFormatter } from '../Formatters';
import { PresetInventoryIconFilled } from '../Icons';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { LanguageEngagementListItemFragment } from './LanguageEngagementListItem.generated';

const useStyles = makeStyles(({ spacing }) => {
  const cardWidth = 600;
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

    cardContent: {
      flex: 1,
      padding: spacing(2, 3),
      display: 'flex',
    },
    leftContent: {
      flex: 1,
    },
    rightContent: {
      flex: 0,
      textAlign: 'right',
      marginLeft: spacing(2),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
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
    presetInventory: {
      verticalAlign: 'bottom',
      marginLeft: spacing(1),
    },
  };
});

export type LanguageEngagementListItemCardProps =
  LanguageEngagementListItemFragment & {
    className?: string;
  };

export const LanguageEngagementListItemCard: FC<LanguageEngagementListItemCardProps> =
  ({ id, language: securedLanguage, project, className, status, products }) => {
    const numberFormatter = useNumberFormatter();
    const classes = useStyles();

    const language = securedLanguage.value;
    const name = language?.name.value ?? language?.displayName.value;
    const population = language?.population.value;
    const registryOfDialectsCode = language?.registryOfDialectsCode.value;
    const ethnologueCode = language?.ethnologue.code.value;

    return (
      <Card className={clsx(classes.root, className)}>
        <CardActionAreaLink to={`engagements/${id}`} className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Grid
              container
              direction="column"
              justify="space-between"
              spacing={1}
              className={classes.leftContent}
            >
              <Grid item>
                <Typography variant="h4">
                  {name}
                  {project.presetInventory.value && (
                    <PresetInventoryIconFilled
                      color="action"
                      className={classes.presetInventory}
                      aria-label="preset inventory"
                    />
                  )}
                </Typography>
              </Grid>
              <DisplaySimpleProperty
                label="Registry Of Dialects Code"
                value={registryOfDialectsCode}
                wrap={(node) => <Grid item>{node}</Grid>}
              />
              <DisplaySimpleProperty
                label="Ethnologue Code"
                value={ethnologueCode}
                wrap={(node) => <Grid item>{node}</Grid>}
              />
              <DisplaySimpleProperty
                label="Population"
                value={numberFormatter(population)}
                wrap={(node) => <Grid item>{node}</Grid>}
              />
              <DisplaySimpleProperty
                label="Status"
                value={displayEngagementStatus(status.value)}
                wrap={(node) => <Grid item>{node}</Grid>}
              />
            </Grid>
            <div className={classes.rightContent}>
              <DisplaySimpleProperty aria-hidden="true" />
              <div>
                <Typography variant="h1">
                  {numberFormatter(products.total)}
                </Typography>
                <Typography variant="body2" color="primary">
                  Goals
                </Typography>
              </div>
            </div>
          </CardContent>
        </CardActionAreaLink>
        <CardActions>
          <ButtonLink to={`engagements/${id}`} color="primary">
            View Details
          </ButtonLink>
        </CardActions>
      </Card>
    );
  };
