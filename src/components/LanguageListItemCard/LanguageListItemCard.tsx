import { Card, CardContent, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { FC } from 'react';
import * as React from 'react';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { useNumberFormatter } from '../Formatters';
import { CardActionAreaLink } from '../Routing';
import { LanguageListItemFragment } from './LanguageListItem.generated';

const useStyles = makeStyles(({ spacing }) => {
  return {
    root: {
      width: '100%',
      maxWidth: 400,
    },
    cardContent: {
      display: 'flex',
      justifyContent: 'space-between',
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
    name: {
      marginBottom: spacing(2),
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
  const population =
    language?.organizationPopulation?.value ??
    language?.ethnologuePopulation?.value;

  return (
    <Card className={clsx(classes.root, className)}>
      <CardActionAreaLink
        disabled={!language}
        to={`/languages/${language?.id}`}
      >
        <CardContent className={classes.cardContent}>
          <div className={classes.leftContent}>
            <Typography variant="h4" className={classes.name}>
              {!language ? (
                <Skeleton width="50%" variant="text" />
              ) : (
                language.name?.value ?? language.displayName?.value
              )}
            </Typography>
            <DisplaySimpleProperty
              LabelProps={{ color: 'textSecondary' }}
              label="Ethnologue"
              value={language?.ethnologueName?.value}
              loading={!language}
              loadingWidth="25%"
            />
            <DisplaySimpleProperty
              LabelProps={{ color: 'textSecondary' }}
              label="ROD"
              value={language?.rodNumber?.value}
              loading={!language}
              loadingWidth="25%"
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
        </CardContent>
      </CardActionAreaLink>
    </Card>
  );
};
