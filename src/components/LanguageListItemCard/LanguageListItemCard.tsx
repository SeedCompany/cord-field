import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { FC } from 'react';
import * as React from 'react';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { useNumberFormatter } from '../Formatters';
import { PresetInventoryIconFilled } from '../Icons';
import { CardActionAreaLink } from '../Routing';
import { Sensitivity } from '../Sensitivity';
import { LanguageListItemFragment } from './LanguageListItem.generated';

const useStyles = makeStyles(({ spacing }) => {
  return {
    root: {
      width: '100%',
      maxWidth: 400,
    },
    name: {
      marginBottom: spacing(2),
    },
    bottomSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    leftContent: {
      flex: 1,
    },
    rightContent: {
      marginLeft: spacing(2),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      textAlign: 'right',
    },
    sensitivity: {
      marginTop: spacing(1),
    },
  };
});

export interface LanguageListItemCardProps {
  className?: string;
  language?: LanguageListItemFragment;
}

export const LanguageListItemCard: FC<LanguageListItemCardProps> = ({
  className,
  language,
}) => {
  const classes = useStyles();
  const formatNumber = useNumberFormatter();
  const population = language?.population.value;

  return (
    <Card className={clsx(classes.root, className)}>
      <CardActionAreaLink
        disabled={!language}
        to={`/languages/${language?.id}`}
      >
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={language ? undefined : true}>
              <Typography variant="h4" className={classes.name}>
                {!language ? (
                  <Skeleton width="50%" variant="text" />
                ) : (
                  language.name.value ?? language.displayName.value
                )}
              </Typography>
            </Grid>

            {language?.presetInventory.value && (
              <Grid item>
                <PresetInventoryIconFilled
                  color="action"
                  aria-label="preset inventory"
                />
              </Grid>
            )}
          </Grid>
          <div className={classes.bottomSection}>
            <div className={classes.leftContent}>
              <DisplaySimpleProperty
                LabelProps={{ color: 'textSecondary' }}
                label="Ethnologue Code"
                value={language?.ethnologue.code.value}
                loading={!language}
                loadingWidth="25%"
              />
              <DisplaySimpleProperty
                LabelProps={{ color: 'textSecondary' }}
                label="Registry of Dialects Code"
                value={language?.registryOfDialectsCode.value}
                loading={!language}
                loadingWidth="25%"
              />
              <Sensitivity
                value={language?.sensitivity}
                loading={!language}
                className={classes.sensitivity}
              />
            </div>
            <div className={classes.rightContent}>
              {!language || population ? (
                <>
                  <Typography variant="body2" color="textSecondary">
                    Population
                  </Typography>
                  <Typography variant="h3">
                    {!language ? (
                      <Skeleton variant="text" />
                    ) : (
                      formatNumber(population)
                    )}
                  </Typography>
                </>
              ) : null}
            </div>
          </div>
        </CardContent>
      </CardActionAreaLink>
    </Card>
  );
};
