import { Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { random } from 'lodash';
import { PartialDeep } from 'type-fest';
import { PartnersQueryVariables } from '../../scenes/Partners/List/PartnerList.graphql';
import { CardActionAreaLink } from '../Routing';
import { TogglePinButton } from '../TogglePinButton';
import { PartnerListItemFragment } from './PartnerListItemCard.graphql';

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
  const org = partner?.organization.value;
  const acronym = org?.acronym.value;
  const name = org?.name.value;

  return (
    <Card
      className={className}
      sx={{
        width: '100%',
        maxWidth: (theme) => theme.breakpoints.values.sm,
        position: 'relative',
      }}
    >
      <CardActionAreaLink
        disabled={!partner}
        to={`/partners/${partner?.id}`}
        sx={{ display: 'flex', alignItems: 'initial' }}
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
        sx={{ position: 'absolute', top: 5, right: 5 }}
        size="small"
      />
    </Card>
  );
};
