import { useQuery } from '@apollo/client';
import {
  Edit,
  Event as EventIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Container,
  Paper,
  Stack,
  Tab,
  Tooltip,
  Typography,
} from '@mui/material';
import { Many, Nil } from '@seedcompany/common';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PartialDeep } from 'type-fest';
import { DataButton } from '~/components/DataButton';
import { useDialog } from '~/components/Dialog';
import { Error } from '~/components/Error';
import { FormattedDate, FormattedDateTime } from '~/components/Formatters';
import { IconButton } from '~/components/IconButton';
import { InactiveStatusIcon } from '~/components/Icons/InactiveStatusIcon';
import { TogglePinButton } from '~/components/TogglePinButton';
import { EnumParam, makeQueryHandler, withDefault } from '~/hooks';
import { EditablePartnerField, EditPartner } from '../Edit';
import { PartnersQueryVariables } from '../List/PartnerList.graphql';
import {
  PartnerDetailsFragment,
  PartnerDocument,
} from './PartnerDetail.graphql';
import { PartnerDetailFinance } from './Tabs/Finance/PartnerDetailFinance';
import { PartnerDetailNotes } from './Tabs/Notes/PartnerDetailsNotes';
import { PartnerDetailPeople } from './Tabs/People/PartnerDetailPeople';
import { PartnerDetailProfile } from './Tabs/Profile/PartnerDetailProfile';
import { PartnerDetailProjects } from './Tabs/Projects/PartnerDetailProjects';

interface PartnerViewEditProps {
  partner: PartnerDetailsFragment | undefined;
  editPartner: (item: Many<EditablePartnerField>) => void;
  includeMembership?: boolean;
}

export const PartnerDetail = () => {
  const { partnerId = '' } = useParams();

  const { data, error } = useQuery(PartnerDocument, {
    variables: {
      input: partnerId,
    },
  });

  const [editPartnerState, editPartner, editField] =
    useDialog<Many<EditablePartnerField>>();

  const partner = data?.partner;

  const viewEdit = { partner, editPartner };

  return (
    <Container maxWidth={false} sx={{ p: 6 }}>
      <Error error={error}>
        {{
          NotFound: 'Could not find partner',
          Default: 'Error loading partner',
        }}
      </Error>
      {!error && (
        <main>
          <PartnerHeader {...viewEdit} />
          <PartnerDataButtons {...viewEdit} />
          <PartnerTabs {...viewEdit} />
        </main>
      )}
      {partner ? (
        <EditPartner
          partner={partner}
          {...editPartnerState}
          editFields={editField}
        />
      ) : null}
    </Container>
  );
};

const PartnerHeader = ({ partner, editPartner }: PartnerViewEditProps) => {
  const partnerName = partner?.organization.value?.name.value;
  const abrev =
    partnerName && partnerName.length >= 30
      ? partner.organization.value.avatarLetters
      : null;

  return (
    <>
      <Helmet title={partnerName ?? undefined} />
      <Stack direction="row" gap={1}>
        <Typography variant="h2" lineHeight="inherit" mr={1}>
          {abrev || partnerName}
        </Typography>
        <Tooltip title="Edit Partner">
          <IconButton
            loading={!partner}
            onClick={() =>
              editPartner(['organizationName', 'globalInnovationsClient'])
            }
          >
            <Edit />
          </IconButton>
        </Tooltip>
        <TogglePinButton
          object={partner}
          label="Partner"
          listId="partners"
          listFilter={(args: PartialDeep<PartnersQueryVariables>) =>
            args.input?.filter?.pinned ?? false
          }
        />
      </Stack>
      {abrev && (
        <Typography variant="h4" gutterBottom>
          {partnerName}
        </Typography>
      )}
      {partner && (
        <Typography variant="body2" color="textSecondary" paragraph>
          Created <FormattedDateTime date={partner.createdAt} />
        </Typography>
      )}
    </>
  );
};

const StatusIcon = ({ isActive }: { isActive: boolean | Nil }) =>
  isActive ? (
    <TimelineIcon color="info" />
  ) : (
    <InactiveStatusIcon color="error" />
  );

const PartnerDataButtons = ({ partner, editPartner }: PartnerViewEditProps) => (
  <Box mt={3} mb={2} display="flex" gap={2}>
    <DataButton
      label="Status"
      onClick={() => editPartner('active')}
      secured={partner?.active}
      startIcon={<StatusIcon isActive={partner?.active.value} />}
      redacted="You do not have permission to view Status"
      children={
        <Box color={partner?.active.value ? 'inherit' : 'text.secondary'}>
          {partner?.active.value ? 'Active' : 'Inactive'}
        </Box>
      }
      loading={!partner}
    />
    <DataButton
      label="Start Date"
      onClick={() => editPartner(['startDate'])}
      secured={partner?.startDate}
      startIcon={<EventIcon color="info" />}
      empty="None"
      redacted="You do not have permission to view start date"
      children={(date) => <FormattedDate date={date} />}
      loading={!partner}
    />
  </Box>
);

const usePartnerDetailsFilters = makeQueryHandler({
  tab: withDefault(
    EnumParam(['profile', 'people', 'projects', 'finance', 'notes']),
    'profile'
  ),
});
const PartnerTabs = (props: PartnerViewEditProps) => {
  const [filters, setFilters] = usePartnerDetailsFilters();

  return (
    <TabContext value={filters.tab}>
      <TabList
        onChange={(_e, tab) => setFilters({ ...filters, tab })}
        aria-label="partner navigation tabs"
      >
        <Tab label="Partner Profile" value="profile" />
        <Tab label="Finance" value="finance" />
        <Tab label="People" value="people" />
        <Tab label="Projects" value="projects" />
        <Tab label="Notes" value="notes" />
      </TabList>
      <Paper sx={{ maxWidth: 'lg' }}>
        <TabPanel value="profile">
          <PartnerDetailProfile {...props} />
        </TabPanel>
        <TabPanel value="finance">
          <PartnerDetailFinance {...props} />
        </TabPanel>
        <TabPanel value="people">
          <PartnerDetailPeople {...props} />
        </TabPanel>
        <TabPanel value="projects" sx={{ p: 0 }}>
          <PartnerDetailProjects />
        </TabPanel>
        <TabPanel value="notes">
          <PartnerDetailNotes {...props} />
        </TabPanel>
      </Paper>
    </TabContext>
  );
};
