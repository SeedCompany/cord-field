import { Paper, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useIsMobile } from '~/common';
import { EntityList as PartnersList } from '~/components/List';
import { PartnerColumns } from '~/components/PartnersDataGrid/PartnerColumns';
import { renderPartnerRow } from '~/components/PartnersDataGrid/renderPartnerRow';
import { PartnerGrid } from './PartnerGrid';
import { PartnersDocument } from './PartnerList.graphql';

export const PartnerList = () => {
  const isMobile = useIsMobile();
  return (
    <Stack sx={{ flex: 1, padding: { xs: 2, md: 4 }, pt: 2 }}>
      <Helmet title="Partners" />
      <Stack component="main" sx={{ flex: 1 }}>
        <Typography variant="h2" paragraph>
          Partners
        </Typography>
        {isMobile ? (
          <PartnersList
            query={PartnersDocument}
            listAt={(data) => data.partners}
            columns={PartnerColumns}
            sortDefault={{ field: 'organization.name', direction: 'ASC' }}
            renderItem={renderPartnerRow}
          />
        ) : (
          // The grid (and its `useDataGridSource`) must only mount on desktop.
          <Stack sx={{ flex: 1, containerType: 'size' }}>
            <Paper
              sx={{
                flex: 1,
                minHeight: 375,
                maxHeight: '100cqh',
                width: 'min-content',
                maxWidth: '100cqw',
              }}
            >
              <PartnerGrid />
            </Paper>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
