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
import { CardActionAreaLink } from '../Routing';
import { Sensitivity } from '../Sensitivity';
import { TogglePinButton } from '../TogglePinButton';
import { LanguageListItemFragment } from './LanguageListItem.graphql';

export interface LanguageListItemCardProps {
  language?: LanguageListItemFragment;
}

export const LanguageListItemCard = ({
  language,
}: LanguageListItemCardProps) => {
  const formatNumber = useNumberFormatter();
  const population = language?.population.value;

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 400,
        position: 'relative',
      }}
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
                  mb: 2,
                }}
              >
                {!language ? (
                  <Skeleton width="50%" variant="text" />
                ) : (
                  language.name.value ?? language.displayName.value
                )}
              </Typography>
            </Grid>
          </Grid>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                flex: 1,
              }}
            >
              <DisplaySimpleProperty
                LabelProps={{ color: 'textSecondary' }}
                label="Ethnologue Code"
                value={language?.ethnologue.code.value}
                loading={!language}
                loadingWidth="25%"
              />
              <DisplaySimpleProperty
                LabelProps={{ color: 'textSecondary' }}
                label="Registry of Language Varieties Code"
                value={language?.registryOfLanguageVarietiesCode.value}
                loading={!language}
                loadingWidth="25%"
              />
              <Sensitivity
                value={language?.sensitivity}
                loading={!language}
                sx={{
                  mt: 1,
                }}
              />
            </div>
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
          </div>
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
