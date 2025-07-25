import {
  Card,
  CardActions,
  CardContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { EngagementStatusLabels } from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import { idForUrl } from '../Changeset';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { useNumberFormatter } from '../Formatters';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { LanguageEngagementListItemFragment } from './LanguageEngagementListItem.graphql';

export type LanguageEngagementListItemCardProps =
  LanguageEngagementListItemFragment & {
    className?: string;
  };

export const LanguageEngagementListItemCard = (
  props: LanguageEngagementListItemCardProps
) => {
  const { language: securedLanguage, className, status, products } = props;

  const numberFormatter = useNumberFormatter();

  const language = securedLanguage.value;
  const name = language?.name.value ?? language?.displayName.value;
  const population = language?.population.value;
  const registryOfLanguageVarietiesCode =
    language?.registryOfLanguageVarietiesCode.value;
  const ethnologueCode = language?.ethnologue.code.value;

  return (
    <Card className={className} sx={{ width: '100%' }}>
      <CardActionAreaLink
        to={`/engagements/${idForUrl(props)}`}
        sx={{
          display: 'flex',
          alignItems: 'initial',
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            px: 3,
            py: 2,
            display: 'flex',
          }}
        >
          <Grid
            container
            direction="column"
            justifyContent="space-between"
            spacing={1}
            sx={{ flex: 1 }}
          >
            <Grid item>
              <Typography variant="h4">{name}</Typography>
            </Grid>
            <DisplaySimpleProperty
              label="Registry Of Language Varieties Code"
              value={registryOfLanguageVarietiesCode}
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
          <Stack
            sx={{
              flex: 0,
              textAlign: 'right',
              ml: 2,
              justifyContent: 'flex-end',
            }}
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
          </Stack>
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
