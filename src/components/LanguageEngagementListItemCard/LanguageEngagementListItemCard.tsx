import {
  Box,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import { EngagementStatusLabels } from '~/api/schema.graphql';
import { extendSx, labelFrom, StyleProps } from '~/common';
import { idForUrl } from '../Changeset';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { useNumberFormatter } from '../Formatters';
import { PresetInventoryIconFilled } from '../Icons';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { LanguageEngagementListItemFragment } from './LanguageEngagementListItem.graphql';

export type LanguageEngagementListItemCardProps =
  LanguageEngagementListItemFragment &
    StyleProps & {
      className?: string;
    };

export const LanguageEngagementListItemCard = (
  props: LanguageEngagementListItemCardProps
) => {
  const {
    language: securedLanguage,
    project,
    className,
    status,
    products,
    sx,
  } = props;

  const numberFormatter = useNumberFormatter();
  const language = securedLanguage.value;
  const name = language?.name.value ?? language?.displayName.value;
  const population = language?.population.value;
  const registryOfDialectsCode = language?.registryOfDialectsCode.value;
  const ethnologueCode = language?.ethnologue.code.value;

  return (
    <Card
      className={className}
      sx={[
        {
          width: '100%',
        },
        ...extendSx(sx),
      ]}
    >
      <CardActionAreaLink
        to={`/engagements/${idForUrl(props)}`}
        sx={{
          display: 'flex',
          alignItems: 'initial',
        }}
      >
        <CardContent
          sx={(theme) => ({
            flex: 1,
            padding: theme.spacing(2, 3),
            display: 'flex',
          })}
        >
          <Grid
            container
            direction="column"
            justifyContent="space-between"
            spacing={1}
            sx={{
              flex: 1,
            }}
          >
            <Grid item>
              <Typography variant="h4">
                {name}
                {project.presetInventory.value && (
                  <PresetInventoryIconFilled
                    color="action"
                    aria-label="preset inventory"
                    sx={(theme) => ({
                      verticalAlign: 'bottom',
                      marginLeft: theme.spacing(1),
                    })}
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
              value={labelFrom(EngagementStatusLabels)(status.value)}
              wrap={(node) => <Grid item>{node}</Grid>}
            />
          </Grid>
          <Box
            sx={(theme) => ({
              flex: 0,
              textAlign: 'right',
              marginLeft: theme.spacing(2),
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            })}
          >
            <DisplaySimpleProperty aria-hidden="true" />
            <div>
              <Typography variant="h1">
                {numberFormatter(products.total)}
              </Typography>
              <Typography variant="body2" color="primary">
                Goals
              </Typography>
            </div>
          </Box>
        </CardContent>
      </CardActionAreaLink>
      <CardActions>
        <ButtonLink to={`/engagements/${idForUrl(props)}`} color="primary">
          View Details
        </ButtonLink>
      </CardActions>
    </Card>
  );
};
