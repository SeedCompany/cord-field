import { Box, Card, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { DashboardLayout, DashboardWidget } from '~/components/DashboardLayout';

export const MyDashboard = () => {
  return (
    <Box
      component="main"
      sx={{ height: 1, p: 2, display: 'flex', flexDirection: 'column' }}
    >
      <Helmet title="My Dashboard" />

      <Card sx={{ backgroundColor: '#A6DBC7', p: 4, mb: 2 }} elevation={0}>
        <Typography variant="h3">My Dashboard</Typography>
      </Card>

      <DashboardLayout gap={2}>
        <DashboardWidget
          colSpan={8}
          rowSpan={6}
          title="Test partner detail table"
          to="partners"
          key="table"
        >
          <Box
            sx={{
              '.MuiDataGrid-virtualScrollerContent': {
                height: '100cqh !important',
              },
            }}
          >
            Partner table
          </Box>
        </DashboardWidget>
        <DashboardWidget
          title="Something"
          colSpan={4}
          rowSpan={12}
          key="something"
        >
          <Typography>
            Contrary to popular belief, Lorem Ipsum is not simply random text.
            It has roots in a piece of classical Latin literature from 45 BC,
            making it over 2000 years old. Richard McClintock, a Latin professor
            at Hampden-Sydney College in Virginia, looked up one of the more
            obscure Latin words, consectetur, from a Lorem Ipsum passage, and
            going through the cites of the word in classical literature,
            discovered the undoubtable source. Lorem Ipsum comes from sections
            1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes
            of Good and Evil) by Cicero, written in 45 BC. This book is a
            treatise on the theory of ethics, very popular during the
            Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit
            amet..", comes from a line in section 1.10.32.
          </Typography>
        </DashboardWidget>
        <DashboardWidget
          title="Somthing else"
          colSpan={8}
          rowSpan={6}
          key="something-else"
        >
          <Typography>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </Typography>
        </DashboardWidget>
      </DashboardLayout>
    </Box>
  );
};
