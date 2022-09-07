import { Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import { random } from 'lodash';
import { makeStyles } from 'tss-react/mui';
import { PartialDeep } from 'type-fest';
import { PartnersQueryVariables } from '../../scenes/Partners/List/PartnerList.graphql';
import { CardActionAreaLink } from '../Routing';
import { TogglePinButton } from '../TogglePinButton';
import { PartnerListItemFragment } from './PartnerListItemCard.graphql';

const useStyles = makeStyles()(({ breakpoints, spacing }) => {
  const cardWidth = breakpoints.values.sm;
  return {
    root: {
      width: '100%',
      maxWidth: cardWidth,
      position: 'relative',
    },
    card: {
      display: 'flex',
      alignItems: 'initial',
    },
    cardContent: {
      flex: 1,
      padding: spacing(2, 3),
      display: 'flex',
      justifyContent: 'space-between',
    },
    pin: {
      position: 'absolute',
      top: 5,
      right: 5,
    },
  };
});
export interface PartnerListItemCardProps {
  partner?: PartnerListItemFragment;
  className?: string;
}

// min/max is based on production data
const randomNameLength = () => random(3, 50);

export const PartnerListItemCard = ({
  partner,
  className,
}: PartnerListItemCardProps) => {
  const { classes, cx } = useStyles();

  return (
    <Card className={cx(className, classes.root)}>
      <CardActionAreaLink
        disabled={!partner}
        to={`/partners/${partner?.id}`}
        className={classes.card}
      >
        <CardContent className={classes.cardContent}>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography variant="h4">
                {!partner ? (
                  <Skeleton variant="text" width={`${randomNameLength()}ch`} />
                ) : (
                  partner.organization.value?.name.value
                )}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionAreaLink>
      <TogglePinButton
        object={partner}
        label="Partner"
        listId="partners"
        listFilter={(args: PartialDeep<PartnersQueryVariables>) =>
          args.input?.filter?.pinned ?? false
        }
        className={classes.pin}
        size="small"
      />
    </Card>
  );
};
