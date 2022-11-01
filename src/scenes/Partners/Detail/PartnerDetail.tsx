import { useQuery } from '@apollo/client';
import { Add, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  CardActionArea,
  CardContent,
  Grid,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Many } from 'lodash';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PartialDeep } from 'type-fest';
import { listOrPlaceholders, square } from '~/common';
import { Avatar } from '../../../components/Avatar';
import { BooleanProperty } from '../../../components/BooleanProperty';
import { DataButton } from '../../../components/DataButton';
import { useDialog } from '../../../components/Dialog';
import { Error } from '../../../components/Error';
import { useDateTimeFormatter } from '../../../components/Formatters';
import { IconButton } from '../../../components/IconButton';
import { ProjectListItemCard } from '../../../components/ProjectListItemCard';
import { TogglePinButton } from '../../../components/TogglePinButton';
import { UserListItemCardPortrait } from '../../../components/UserListItemCard';
import { EditablePartnerField, EditPartner } from '../Edit';
import { PartnersQueryVariables } from '../List/PartnerList.graphql';
import { AddressCard } from './AddressCard';
import { PartnerDocument } from './PartnerDetail.graphql';
import { PartnerPostList } from './PartnerPostList';
import { PartnerTypesCard } from './PartnerTypesCard';

const cardSection = {
  '& > h3': {
    mb: 1,
  },
  display: 'flex',
  flexDirection: 'column',
};

const card = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
};

export const PartnerDetail = () => {
  const { partnerId = '' } = useParams();
  const formatDateTime = useDateTimeFormatter();

  const { data, error } = useQuery(PartnerDocument, {
    variables: {
      input: partnerId,
    },
  });
  const partner = data?.partner;
  const name = partner?.organization.value?.name.value;
  const projects = partner?.projects;

  const [editPartnerState, editPartner, editField] =
    useDialog<Many<EditablePartnerField>>();

  return (
    <Box component="main" sx={{ flex: 1, overflowY: 'auto', p: 4 }}>
      <Helmet title={name ?? undefined} />
      <Error error={error}>
        {{
          NotFound: 'Could not find partner',
          Default: 'Error loading partner',
        }}
      </Error>
      {!error && (
        <Box
          sx={{
            maxWidth: 'md',
            '& > *': {
              mb: 3,
            },
          }}
        >
          <Box component="header" sx={{ flex: 1, display: 'flex', gap: 1 }}>
            <Typography
              variant="h2"
              sx={{
                mr: 2, // a little extra between text and buttons
                lineHeight: 'inherit', // centers text with buttons better
              }}
            >
              {partner ? (
                partner.organization.value?.name.value
              ) : (
                <Skeleton width="25ch" />
              )}
            </Typography>
            {partner && (
              <Tooltip title="Edit Partner">
                <IconButton
                  aria-label="Edit Partner"
                  onClick={() =>
                    editPartner(['organizationName', 'globalInnovationsClient'])
                  }
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
            <TogglePinButton
              object={partner}
              label="Partner"
              listId="partners"
              listFilter={(args: PartialDeep<PartnersQueryVariables>) =>
                args.input?.filter?.pinned ?? false
              }
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" sx={{ mr: 2 }}>
              {partner ? 'Partner Information' : <Skeleton width={200} />}
            </Typography>
            {partner && (
              <Typography variant="body2" color="textSecondary">
                Created {formatDateTime(partner.createdAt)}
              </Typography>
            )}
          </Box>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <DataButton
                onClick={() => editPartner('active')}
                secured={partner?.active}
                redacted="You do not have permission to view Status"
                children={partner?.active.value ? 'Active' : 'Inactive'}
                loading={!partner}
                empty="Enter Status"
              />
            </Grid>
            <Grid item>
              <DataButton
                onClick={() => editPartner('pmcEntityCode')}
                secured={partner?.pmcEntityCode}
                redacted="You do not have permission to view PMC Entity Code"
                children={
                  partner?.pmcEntityCode.value &&
                  `PMC Entity Code: ${partner.pmcEntityCode.value}`
                }
                empty="Enter PMC Entity Code"
                loading={!partner}
              />
            </Grid>
            <BooleanProperty
              label="Global Innovations Client"
              redacted="You do not have permission to view whether this is a Global Innovations Client"
              data={partner?.globalInnovationsClient}
              wrap={(node) => <Grid item>{node}</Grid>}
            />
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={6} sx={cardSection}>
              <Typography variant="h3">
                {partner ? 'Partner Types' : <Skeleton width="120px" />}
              </Typography>
              <PartnerTypesCard
                partner={partner}
                onEdit={() => editPartner(['types', 'financialReportingTypes'])}
                sx={card}
              />
            </Grid>
            <Grid item xs={6} sx={cardSection}>
              <Typography variant="h3">
                {partner ? 'Address' : <Skeleton width="120px" />}
              </Typography>
              <AddressCard
                partner={partner}
                onEdit={() => editPartner('address')}
                sx={card}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
              '& > *': {
                mr: 2,
              },
            }}
          >
            <Typography variant="h3">
              {partner ? 'Point of Contact' : <Skeleton width="120px" />}
            </Typography>
          </Box>
          <UserListItemCardPortrait
            user={partner?.pointOfContact.value || undefined}
            content={
              !partner?.pointOfContact.value ? (
                <CardActionArea
                  onClick={() => editPartner('pointOfContactId')}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  aria-label="add mentor"
                >
                  <CardContent>
                    <Avatar
                      sx={{
                        ...square(86),
                        fontSize: 70,
                        color: 'background.paper',
                      }}
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
                onClick={() => editPartner('pointOfContactId')}
              >
                {partner?.pointOfContact.value ? 'Edit' : 'Add'} Point of
                Contact
              </Button>
            }
          />
          <Grid item xs={12}>
            <Typography variant="h3" paragraph>
              Projects
            </Typography>
            {projects?.canRead === false ? (
              <Typography color="textSecondary">
                You don't have permission to see the projects this partner is
                engaged in
              </Typography>
            ) : projects?.items.length === 0 ? (
              <Typography color="textSecondary">
                This partner is not engaged in any projects
              </Typography>
            ) : (
              listOrPlaceholders(projects?.items, 3).map((project, index) => (
                <ProjectListItemCard
                  key={project?.id ?? index}
                  project={project}
                  sx={{ mb: 2 }}
                />
              ))
            )}
          </Grid>
          <Grid>{!!partner && <PartnerPostList partner={partner} />}</Grid>
        </Box>
      )}
      {partner ? (
        <EditPartner
          partner={partner}
          {...editPartnerState}
          editFields={editField}
        />
      ) : null}
    </Box>
  );
};
