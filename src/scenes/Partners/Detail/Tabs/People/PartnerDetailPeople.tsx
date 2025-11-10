import { Add } from '@mui/icons-material';
import {
  Button,
  CardActionArea,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material';
import { Many } from 'lodash';
import { square } from '~/common';
import { Avatar } from '~/components/Avatar';
import { TabPanelContent } from '~/components/Tabs';
import { UserListItemCardPortrait } from '~/components/UserListItemCard';
import { EditablePartnerField } from '../../../Edit';
import { PartnerDetailPeopleFragment } from './PartnerDetailsPeople.graphql';

interface Props {
  partner: PartnerDetailPeopleFragment | undefined;
  editPartner: (item: Many<EditablePartnerField>) => void;
}

export const PartnerDetailPeople = ({ partner, editPartner: edit }: Props) => {
  return (
    <TabPanelContent sx={{ pb: 4 }}>
      <Typography variant="h3" gutterBottom>
        {partner ? 'Point of Contact' : <Skeleton width="120px" />}
      </Typography>
      <UserListItemCardPortrait
        user={partner?.pointOfContact.value || undefined}
        content={
          !partner?.pointOfContact.value ? (
            <CardActionArea
              onClick={() => edit('partner.pointOfContactId')}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
              aria-label="add mentor"
            >
              <CardContent>
                <Avatar
                  sx={(theme) => ({
                    ...square(86),
                    fontSize: 70,
                    color: theme.palette.background.paper,
                  })}
                >
                  <Add fontSize="inherit" />
                </Avatar>
              </CardContent>
            </CardActionArea>
          ) : undefined
        }
        action={
          <Button
            color="primary"
            disabled={
              !partner?.pointOfContact || !partner.pointOfContact.canEdit
            }
            onClick={() => edit('partner.pointOfContactId')}
          >
            {partner?.pointOfContact.value ? 'Edit' : 'Add'} Point of Contact
          </Button>
        }
      />
    </TabPanelContent>
  );
};
