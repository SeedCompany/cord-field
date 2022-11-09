import { Box, Tab, Tabs, Typography } from '@mui/material';
import { groupBy } from 'lodash';
import { useState } from 'react';
import { ProductTable } from '../../../Detail/ProductTable';
import { useProgressReportContext } from '../../../ProgressReportContext';

export const ProgressStep = () => {
  const { currentReport } = useProgressReportContext();
  const [tab, setTab] = useState(0);

  if (!currentReport?.progress) {
    return (
      <div>
        Something is wrong, we could not find the progress step in the current
        report
      </div>
    );
  }
  const grouped = groupBy(
    currentReport.progress,
    (product) => product.product.category
  );

  console.log(grouped);

  return (
    <div
      css={(theme) => ({
        marginBottom: theme.spacing(4),
      })}
    >
      <Typography variant="h4" sx={{ my: 4 }}>
        (TENTATIVE COPY) Please upload the PnP for this reporting period. The
        progress data will populate the charts below.
      </Typography>

      <Tabs
        value={tab}
        indicatorColor="primary"
        textColor="primary"
        onChange={(_, value) => setTab(value)}
        sx={{ mb: 2 }}
      >
        <Tab label="Field Partner" />
        <Tab label="Translator" />
        <Tab label="Project Manager" />
        <Tab label="Marketing" />
      </Tabs>
      <Box hidden={tab !== 0}>
        {Object.entries(grouped).map(([category, products]) => (
          <ProductTable
            key={category}
            category={category}
            products={products}
          />
        ))}
      </Box>
    </div>
  );
};
