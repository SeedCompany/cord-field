import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import { PartialDeep } from 'type-fest';
import { LanguagesQueryVariables } from '../../scenes/Languages/List/languages.graphql';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { useNumberFormatter } from '../Formatters';
import { PresetInventoryIconFilled } from '../Icons';
import { CardActionAreaLink } from '../Routing';
import { Sensitivity } from '../Sensitivity';
import { TogglePinButton } from '../TogglePinButton';
import { LanguageListItemFragment } from './LanguageListItem.graphql';

const classes = {
  root: {
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  name: {
    marginBottom: 2,
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
    marginLeft: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  sensitivity: {
    marginTop: 1,
  },
  pin: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
};

export interface LanguageListItemCardProps {
  className?: string;
  language?: LanguageListItemFragment;
}

export const LanguageListItemCard = ({
  className,
  language,
}: LanguageListItemCardProps) => {
  const formatNumber = useNumberFormatter();
  const population = language?.population.value;

  return (
    <Card className={className} sx={classes.root}>
      <CardActionAreaLink
        disabled={!language}
        to={`/languages/${language?.id}`}
      >
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={language ? undefined : true}>
              <Typography variant="h4" sx={classes.name}>
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
          <Box sx={classes.bottomSection}>
            <Box sx={classes.leftContent}>
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
                sx={classes.sensitivity}
              />
            </Box>
            <Box sx={classes.rightContent}>
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
            </Box>
          </Box>
        </CardContent>
      </CardActionAreaLink>
      <TogglePinButton
        object={language}
        label="Language"
        listId="languages"
        listFilter={(args: PartialDeep<LanguagesQueryVariables>) =>
          args.input?.filter?.pinned ?? false
        }
        sx={classes.pin}
      />
    </Card>
  );
};
