import { Card, CardContent, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { FC } from 'react';
import * as React from 'react';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { useNumberFormatter } from '../Formatters';
import { ToggleFlagButton } from '../InventoryFlagButton';
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
    flag: {
      position: 'relative',
      top: 5,
      fontSize: 10,
      right: 10,
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

  const approvedInventoryProject = language?.projects.items.find(
    (item) => item.approvedInventory
  );

  return (
    <Card className={clsx(classes.root, className)}>
      <div className={classes.rightContent}>
        <ToggleFlagButton
          object={approvedInventoryProject}
          listId="projects"
          className={classes.flag}
          readOnly={true}
        />
      </div>
      <CardActionAreaLink
        disabled={!language}
        to={`/languages/${language?.id}`}
      >
        <CardContent>
          <Typography variant="h4" className={classes.name}>
            {!language ? (
              <Skeleton width="50%" variant="text" />
            ) : (
              language.name.value ?? language.displayName.value
            )}
          </Typography>
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
