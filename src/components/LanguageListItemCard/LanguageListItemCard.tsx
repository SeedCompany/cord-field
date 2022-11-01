import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import { PartialDeep } from 'type-fest';
import { extendSx, StyleProps } from '~/common';
import { LanguagesQueryVariables } from '../../scenes/Languages/List/languages.graphql';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { useNumberFormatter } from '../Formatters';
import { PresetInventoryIconFilled } from '../Icons';
import { CardActionAreaLink } from '../Routing';
import { Sensitivity } from '../Sensitivity';
import { TogglePinButton } from '../TogglePinButton';
import { LanguageListItemFragment } from './LanguageListItem.graphql';

export interface LanguageListItemCardProps extends StyleProps {
  className?: string;
  language?: LanguageListItemFragment;
}

export const LanguageListItemCard = ({
  className,
  language,
  sx,
}: LanguageListItemCardProps) => {
  const formatNumber = useNumberFormatter();
  const population = language?.population.value;

  return (
    <Card
      className={className}
      sx={[
        {
          width: '100%',
          maxWidth: 400,
          position: 'relative',
        },
        ...extendSx(sx),
      ]}
    >
      <CardActionAreaLink
        disabled={!language}
        to={`/languages/${language?.id}`}
      >
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={language ? undefined : true}>
              <Typography
                variant="h4"
                sx={{
                  marginBottom: 2,
                }}
              >
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <Box sx={{ flex: 1 }}>
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
                sx={{ marginTop: 1 }}
              />
            </Box>
            <Box
              sx={{
                marginLeft: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                textAlign: 'right',
              }}
            >
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
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}
      />
    </Card>
  );
};
