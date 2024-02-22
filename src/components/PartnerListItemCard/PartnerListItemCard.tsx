import { Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { random } from 'lodash';
import { makeStyles } from 'tss-react/mui';
import { PartialDeep } from 'type-fest';
import { PartnersQueryVariables } from '../../scenes/Partners/List/PartnerList.graphql';
import { CardActionAreaLink } from '../Routing';
import { TogglePinButton } from '../TogglePinButton';
import { PartnerListItemFragment } from './PartnerListItemCard.graphql';

const useStyles = makeStyles()(({ breakpoints }) => {
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

  const org = partner?.organization.value;
  const acronym = org?.acronym.value;
  const name = org?.name.value;

  return (
    <Card className={cx(className, classes.root)}>
      <CardActionAreaLink
        disabled={!partner}
        to={`/partners/${partner?.id}`}
        className={classes.card}
      >
        <Stack component={CardContent} flex={1} gap={1}>
          <Typography variant="h4">
            {!partner ? (
              <Skeleton variant="text" width={`${randomNameLength()}ch`} />
            ) : (
              acronym ?? name
            )}
          </Typography>
          {(!partner || acronym) && (
            <Typography>
              {!partner ? (
                <Skeleton variant="text" width={`${randomNameLength()}ch`} />
              ) : acronym ? (
                name
              ) : null}
            </Typography>
          )}
        </Stack>
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
