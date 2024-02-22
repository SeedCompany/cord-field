import { Add } from '@mui/icons-material';
import {
  Box,
  Button,
  CardActionArea,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material';
import { Many } from 'lodash';
import { makeStyles } from 'tss-react/mui';
import { square } from '~/common';
import { Avatar } from '~/components/Avatar';
import { UserListItemCardPortrait } from '~/components/UserListItemCard';
import { EditablePartnerField } from '../../../Edit';
import { PartnerDetailPeopleFragment } from './PartnerDetailsPeople.graphql';

interface Props {
  partner: PartnerDetailPeopleFragment | undefined;
  editPartner: (item: Many<EditablePartnerField>) => void;
}

const useStyles = makeStyles()(({ palette }) => ({
  pocCardActionArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  pocCardAvatar: {
    ...square(86),
    fontSize: 70,
    color: palette.background.paper,
  },
}));

export const PartnerDetailPeople = ({ partner, editPartner: edit }: Props) => {
  const { classes } = useStyles();

  return (
    <Box pb={2}>
      <Typography variant="h3" gutterBottom>
        {partner ? 'Point of Contact' : <Skeleton width="120px" />}
      </Typography>
      <UserListItemCardPortrait
        user={partner?.pointOfContact.value || undefined}
        content={
          !partner?.pointOfContact.value ? (
            <CardActionArea
              onClick={() => edit('partner.pointOfContactId')}
              className={classes.pocCardActionArea}
              aria-label="add mentor"
            >
              <CardContent>
                <Avatar className={classes.pocCardAvatar}>
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
    </Box>
  );
};
