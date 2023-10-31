import {
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { EngagementStatusLabels } from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import { idForUrl } from '../Changeset';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { useNumberFormatter } from '../Formatters';
import { PresetInventoryIconFilled } from '../Icons';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { LanguageEngagementListItemFragment } from './LanguageEngagementListItem.graphql';

const useStyles = makeStyles()(({ spacing }) => ({
  root: {
    width: '100%',
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
  presetInventory: {
    verticalAlign: 'bottom',
    marginLeft: spacing(1),
  },
}));

export type LanguageEngagementListItemCardProps =
  LanguageEngagementListItemFragment & {
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
    nameWhenUnknown,
  } = props;

  const numberFormatter = useNumberFormatter();
  const { classes, cx } = useStyles();

  const language = securedLanguage.value;
  const name =
    language?.name.value ??
    language?.displayName.value ??
    nameWhenUnknown.value;
  const population = language?.population.value;
  const registryOfDialectsCode = language?.registryOfDialectsCode.value;
  const ethnologueCode = language?.ethnologue.code.value;

  return (
    <Card className={cx(classes.root, className)}>
      <CardActionAreaLink
        to={`/engagements/${idForUrl(props)}`}
        className={classes.card}
      >
        <CardContent className={classes.cardContent}>
          <Grid
            container
            direction="column"
            justifyContent="space-between"
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
              value={labelFrom(EngagementStatusLabels)(status.value)}
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
        <ButtonLink to={`/engagements/${idForUrl(props)}`} color="primary">
          View Details
        </ButtonLink>
      </CardActions>
    </Card>
  );
};
