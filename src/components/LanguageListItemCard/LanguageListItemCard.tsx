import { Card, CardContent, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { FC } from 'react';
import * as React from 'react';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { CardActionAreaLink } from '../Routing';
import { LanguageListItemFragment } from './LanguageListItem.generated';

const useStyles = makeStyles(({ spacing }) => {
  return {
    root: {
      width: '100%',
      maxWidth: '400px',
    },
    cardContent: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    rightContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
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

  return (
    <Card className={clsx(classes.root, className)}>
      <CardActionAreaLink
        disabled={!language}
        to={`/languages/${language?.id}`}
      >
        <CardContent className={classes.cardContent}>
          <div>
            <Typography variant="h4" className={classes.name}>
              {!language ? (
                <Skeleton className={classes.name} width="9ch" variant="text" />
              ) : (
                language.name?.value ?? language.displayName?.value
              )}
            </Typography>
            {!language ? (
              <Skeleton width="9ch" variant="text" />
            ) : (
              <DisplaySimpleProperty
                LabelProps={{ color: 'textSecondary' }}
                label="Ethnologue"
                value={language.ethnologueName?.value}
              />
            )}
            {!language ? (
              <Skeleton width="9ch" variant="text" />
            ) : (
              <DisplaySimpleProperty
                LabelProps={{ color: 'textSecondary' }}
                label="ROD"
                value={language.rodNumber?.value}
              />
            )}
          </div>
          <div className={classes.rightContent}>
            <Typography variant="body2" color="textSecondary">
              Population
            </Typography>
            <Typography variant="h3">
              {!language ? (
                <Skeleton variant="text" />
              ) : (
                language.organizationPopulation?.value ??
                language.ethnologuePopulation?.value
              )}
            </Typography>
          </div>
        </CardContent>
      </CardActionAreaLink>
    </Card>
  );
};
