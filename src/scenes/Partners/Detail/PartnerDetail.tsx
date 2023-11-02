import { useQuery } from '@apollo/client';
import { Edit } from '@mui/icons-material';
import { TabList as ActualTabList, TabContext, TabPanel } from '@mui/lab';
import {
  type Tabs as __Tabs,
  Box,
  Container,
  Paper,
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
import { EditablePartnerField, EditPartner } from '../Edit';
import { PartnersQueryVariables } from '../List/PartnerList.graphql';
import { PartnerDocument } from './PartnerDetail.graphql';
import { usePartnerDetailsFilters } from './PartnerDetailOptions';
import { PartnerDetailPeople } from './Tabs/People/PartnerDetailPeople';
import { PartnerDetailProfile } from './Tabs/Profile/PartnerDetailProfile';
import { PartnerDetailProjects } from './Tabs/Projects/PartnerDetailProjects';

export const PartnerDetail = () => {
  const { partnerId = '' } = useParams();

  const { data, error } = useQuery(PartnerDocument, {
    variables: {
      input: partnerId,
    },
  });
  const partner = data?.partner;
  const name = partner?.organization.value?.name.value;

  const [editPartnerState, editPartner, editField] =
    useDialog<Many<EditablePartnerField>>();

  const [filters, setFilters] = usePartnerDetailsFilters();

  const TabList = ActualTabList as typeof __Tabs;
  const partnerName = partner?.organization.value?.name.value;
  const abrev =
    partnerName && partnerName.length >= 30
      ? partnerName.substring(0, 2)
      : null;

  const tabPanelStyle = {
    overflowY: 'auto',
    pl: 3,
  };

  const tabStyle = {
    textTransform: 'uppercase',
    '&.Mui-selected': {
      transform: 'scale(1)', // Should this be done in overrides instead? That would affect all the tabs which seems more consistent
    },
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        p: 6,
      }}
    >
      <Helmet title={name ?? undefined} />
      <Error error={error}>
        {{
          NotFound: 'Could not find partner',
          Default: 'Error loading partner',
        }}
      </Error>
      {!error && (
        <main>
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                lineHeight: 'inherit',
                mr: 2,
              }}
            >
              {abrev || partnerName}
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
          <Box>
            {abrev && <Typography variant="h4">{partnerName}</Typography>}
            {partner && (
              <Typography variant="body2" color="textSecondary" paragraph>
                Created <FormattedDateTime date={partner.createdAt} />
              </Typography>
            )}
            <Box
              sx={{
                display: 'flex',
                mt: 3,
                mb: 3,
              }}
            >
              <DataButton
                onClick={() => editPartner('active')}
                secured={partner?.active} /**/
                redacted="You do not have permission to view Status"
                children={partner?.active.value ? 'Active' : 'Inactive'}
                loading={!partner}
                color={partner?.active.value ? 'success' : 'error'}
                empty="Enter Status"
              />
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
                variant="text"
              />
            </Box>
          </Box>
          <Paper
            sx={{
              boxShadow: 'none',
              borderRadius: 0,
              width: '100%',
              background: 'transparent',
            }}
          >
            <TabContext value={filters.tab}>
              <TabList
                onChange={(_e, tab) => setFilters({ ...filters, tab })}
                aria-label="partner navigation tabs"
              >
                <Tab label="Partner Profile" value="profile" sx={tabStyle} />
                <Tab label="People" value="people" sx={tabStyle} />
                <Tab label="Projects" value="projects" sx={tabStyle} />
              </TabList>
              <Paper
                sx={{
                  boxShadow: 'none',
                  borderRadius: 0,
                  width: '100%',
                }}
              >
                <TabPanel value="profile" sx={tabPanelStyle}>
                  <PartnerDetailProfile
                    partner={partner}
                    editPartner={editPartner}
                  />
                </TabPanel>
                <TabPanel value="people" sx={tabPanelStyle}>
                  <PartnerDetailPeople
                    partner={partner}
                    editPartner={editPartner}
                  />
                </TabPanel>
                <TabPanel value="projects" sx={tabPanelStyle}>
                  <PartnerDetailProjects partner={partner} />
                </TabPanel>
              </Paper>
            </TabContext>
          </Paper>

          {/*<Grid>{!!partner && <PartnerPostList partner={partner} />}</Grid>*/}
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
