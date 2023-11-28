import { useQuery } from '@apollo/client';
import { Edit } from '@mui/icons-material';
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
import { Many } from '@seedcompany/common';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PartialDeep } from 'type-fest';
import { DataButton } from '~/components/DataButton';
import { useDialog } from '~/components/Dialog';
import { Error } from '~/components/Error';
import { FormattedDateTime } from '~/components/Formatters';
import { IconButton } from '~/components/IconButton';
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
  const partner = data?.partner;

  const [editPartnerState, editPartner, editField] =
    useDialog<Many<EditablePartnerField>>();

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

const PartnerDataButtons = ({ partner, editPartner }: PartnerViewEditProps) => (
  <Box mt={3} mb={2} display="flex" gap={2}>
    <DataButton
      onClick={() => editPartner('active')}
      secured={partner?.active}
      redacted="You do not have permission to view Status"
      children={partner?.active.value ? 'Active' : 'Inactive'}
      loading={!partner}
      color={partner?.active.value ? 'success' : 'error'}
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
      <Paper>
        <TabPanel value="profile">
          <PartnerDetailProfile {...props} />
        </TabPanel>
        <TabPanel value="finance">
          <PartnerDetailFinance {...props} />
        </TabPanel>
        <TabPanel value="people">
          <PartnerDetailPeople {...props} />
        </TabPanel>
        <TabPanel value="projects">
          <PartnerDetailProjects {...props} />
        </TabPanel>
        <TabPanel value="notes">
          {/*This check needs to be done because strict type checking in the posts type wont allow the partner to be undefined*/}
          {props.partner ? (
            <PartnerDetailNotes {...props} partner={props.partner} />
          ) : null}
        </TabPanel>
      </Paper>
    </TabContext>
  );
};
