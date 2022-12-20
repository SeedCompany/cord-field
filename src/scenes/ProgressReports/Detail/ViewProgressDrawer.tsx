import {
  Box,
  Card,
  Divider,
  Drawer,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { groupBy, isEmpty, sortBy } from 'lodash';
import { ReactNode, useMemo, useState } from 'react';
import { useMatch } from 'react-router-dom';
import { RichTextView } from '~/components/RichText';
import { useNavigate } from '~/components/Routing';
import { Error } from '../../../components/Error';
import { ProgressReportContextProvider } from '../EditForm/ProgressReportContext';
import { ProgressReportDrawerHeader } from '../EditForm/ProgressReportDrawerHeader';
import { ProgressReportEditFragment } from '../EditForm/ProgressReportEdit.graphql';
import { VariantSelector } from '../EditForm/Steps/ProgressStep/VariantSelector';
import { VariantResponsesForm } from '../EditForm/Steps/PromptVariant/VariantResponsesForm';
import { ProductTable } from './ProductTable';
import { ProgressSummaryCard } from './ProgressSummaryCard';

interface ProgressReportDrawerProps {
  report: ProgressReportEditFragment;
}

export const ViewProgressReportDrawer = ({
  report,
}: ProgressReportDrawerProps) => {
  const open = !!useMatch('progress-reports/:id/view');

  const navigate = useNavigate();

  const progressByVariant = useMemo(
    () =>
      new Map(
        report.progressForAllVariants.map((progress) => {
          const { variant } = progress[0]!;
          const progressByCategory = groupBy(
            sortBy(progress, ({ product: { category } }) =>
              category === 'Scripture' ? '' : category
            ),
            (product) => product.product.category
          );
          return [variant, progressByCategory];
        })
      ),
    [report]
  );
  const variants = [...progressByVariant.keys()];

  const [variant, setVariant] = useState(variants[0]);

  const progressByCategory = variant
    ? progressByVariant.get(variant)!
    : undefined;

  if (!variant || !progressByCategory || isEmpty(progressByCategory)) {
    return <Error disableButtons>No progress available for this report.</Error>;
  }

  const variantSelector = (
    <VariantSelector
      variants={variants}
      value={variant}
      onChange={setVariant}
    />
  );

  return (
    <ProgressReportContextProvider report={report}>
      <CustomDrawer open={open} onClose={() => navigate('..')}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ProgressReportDrawerHeader />
        </Box>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Stack flex={1} padding={2} maxWidth="md" paddingBottom={6}>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h2">Narrative report</Typography>
                <Grid item xs={12}>
                  {report.highlights.items.map((highlight) => {
                    if (!highlight.prompt.value?.text.value) {
                      return null;
                    }

                    return (
                      <Card key={highlight.id} sx={{ p: 4, my: 2 }}>
                        <Typography variant="h3">Team Highlight:</Typography>
                        <VariantResponsesForm
                          currentItem={highlight}
                          viewOnly
                        />
                      </Card>
                    );
                  })}
                </Grid>
                <Grid item xs={12}>
                  {report.communityStories.items.map((story) => {
                    if (!story.prompt.value?.text.value) {
                      return null;
                    }

                    return (
                      <Card key={story.id} sx={{ p: 4, my: 2 }}>
                        <Typography variant="h3">Community Story:</Typography>
                        <VariantResponsesForm currentItem={story} viewOnly />
                      </Card>
                    );
                  })}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h2">Project Management</Typography>
                <Grid item xs={12}>
                  <Card sx={{ p: 4, my: 2 }}>
                    <Typography variant="h3" gutterBottom>
                      Project Status:
                    </Typography>

                    {report.varianceExplanation.comments.value && (
                      <>
                        <Typography variant="h4" gutterBottom>
                          Comments:
                        </Typography>
                        <Box sx={{ ml: 4 }}>
                          <RichTextView
                            data={report.varianceExplanation.comments.value}
                          />
                        </Box>
                      </>
                    )}

                    {report.varianceExplanation.reasons.value.map(
                      (reason, index) => (
                        <div key={index}>
                          <Typography variant="h4" gutterBottom>
                            Reason {index + 1}:
                          </Typography>
                          <Typography variant="body1" sx={{ ml: 4 }}>
                            {reason}
                          </Typography>
                        </div>
                      )
                    )}
                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h3" gutterBottom>
                      Project progress
                    </Typography>

                    <Stack spacing={4}>
                      <ProgressSummaryCard
                        loading={!report}
                        summary={report.cumulativeSummary ?? null}
                      />

                      {Object.entries(progressByCategory).map(
                        ([category, progress]) => (
                          <ProductTable
                            key={category}
                            category={category}
                            products={progress}
                            GridProps={{
                              pagination: true,
                              components: {
                                Header: () => variantSelector,
                              },
                            }}
                          />
                        )
                      )}
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </CustomDrawer>
    </ProgressReportContextProvider>
  );
};

const CustomDrawer = ({
  children,
  open,
  onClose,
}: {
  children: ReactNode;
  open: boolean;
  onClose?: () => void;
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
        },
      }}
    >
      <Box sx={[{ display: 'flex', height: 1, width: 'calc(100% - 300px)' }]}>
        <Box
          sx={{
            width: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: 2,
            pt: 0,
          }}
        >
          {children}
        </Box>
      </Box>
    </Drawer>
  );
};
