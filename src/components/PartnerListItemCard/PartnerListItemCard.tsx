import { Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import { random } from 'lodash';
import { PartialDeep } from 'type-fest';
import { extendSx, StyleProps } from '~/common';
import { PartnersQueryVariables } from '../../scenes/Partners/List/PartnerList.graphql';
import { CardActionAreaLink } from '../Routing';
import { TogglePinButton } from '../TogglePinButton';
import { PartnerListItemFragment } from './PartnerListItemCard.graphql';

export interface PartnerListItemCardProps extends StyleProps {
  partner?: PartnerListItemFragment;
}

// min/max is based on production data
const randomNameLength = () => random(3, 50);

export const PartnerListItemCard = ({
  partner,
  className,
  sx,
}: PartnerListItemCardProps) => {
  return (
    <Card
      className={className}
      sx={[
        {
          width: '100%',
          maxWidth: 'sm',
          position: 'relative',
        },
        ...extendSx(sx),
      ]}
    >
      <CardActionAreaLink
        disabled={!partner}
        to={`/partners/${partner?.id}`}
        sx={{
          display: 'flex',
          alignItems: 'initial',
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            py: 2,
            px: 3,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
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
        sx={{
          position: 'absolute',
          top: 5,
          right: 5,
        }}
        size="small"
      />
    </Card>
  );
};
