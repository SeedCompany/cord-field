import { DateRange } from '@mui/icons-material';
import { Box, Breadcrumbs, Grid, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import {
  EngagementStatusLabels,
  InternshipPositionLabels,
} from '~/api/schema.graphql';
import { labelFrom, Many } from '~/common';
import { DataButton } from '../../../components/DataButton';
import { DefinedFileCard } from '../../../components/DefinedFileCard';
import { useDialog } from '../../../components/Dialog';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { FieldOverviewCard } from '../../../components/FieldOverviewCard';
import { FileActionsContextProvider } from '../../../components/files/FileActions';
import {
  FormattedDate,
  FormattedDateRange,
  FormattedDateTime,
} from '../../../components/Formatters';
import { OptionsIcon, PlantIcon } from '../../../components/Icons';
import { MethodologiesCard } from '../../../components/MethodologiesCard';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Redacted } from '../../../components/Redacted';
import { Link } from '../../../components/Routing';
import { CeremonyCard } from '../CeremonyCard';
import { DeleteEngagement } from '../Delete';
import {
  EditableEngagementField,
  EditEngagementDialog,
  Engagement,
} from '../EditEngagement/EditEngagementDialog';
import { EngagementWorkflowDialog } from '../EditEngagement/EngagementWorkflowDialog';
import { EngagementQuery } from '../Engagement.graphql';
import { UploadInternshipEngagementGrowthPlanDocument } from '../Files';
import { MentorCard } from './MentorCard';

const nameRedacted = {
  width: '50%',
};

export const InternshipEngagementDetail = ({ engagement }: EngagementQuery) => {
  const [editState, show, editField] =
    useDialog<Many<EditableEngagementField>>();
  const [workflowState, openWorkflow, workflowEngagement] =
    useDialog<Engagement>();

  if (engagement.__typename !== 'InternshipEngagement') {
    return null; // easiest for typescript
  }

  const intern = engagement.intern.value;
  const name = intern?.fullName;

  return (
    <>
      <Helmet
        title={`${name ?? 'An Engagement'} in ${
          engagement.project.name.value ?? 'a project'
        }`}
      />
      <Box sx={{ flex: 1, overflowY: 'auto', p: 4 }}>
        <Grid
          component="main"
          container
          direction="column"
          spacing={3}
          sx={{ maxWidth: 'md' }}
        >
          <Grid item>
            <Breadcrumbs>
              <ProjectBreadcrumb data={engagement.project} />
              <EngagementBreadcrumb data={engagement} />
            </Breadcrumbs>
          </Grid>
          <Grid item>
            <Grid container spacing={3} direction="column">
              <Grid item>
                <Grid container spacing={3} alignItems="center">
                  <Grid item sx={name ? undefined : nameRedacted}>
                    {intern ? (
                      <Link variant="h2" to={`/users/${intern.id}`}>
                        {name ?? (
                          <Redacted
                            info="You do not have permission to view this engagement's name"
                            width="100%"
                          />
                        )}
                      </Link>
                    ) : (
                      <Typography variant="h2">
                        <Redacted
                          info="You do not have permission to view this engagement's intern"
                          width="100%"
                        />
                      </Typography>
                    )}
                  </Grid>
                  <Grid item>
                    <DeleteEngagement
                      project={engagement.project}
                      engagement={engagement}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid item container spacing={3} alignItems="center">
                  <Grid item>
                    <Typography variant="h4">Intern Engagement</Typography>
                  </Grid>

                  <Grid item>
                    <Typography variant="body2" color="textSecondary">
                      Updated <FormattedDateTime date={engagement.modifiedAt} />
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item container spacing={1} alignItems="center">
                <Grid item>
                  <DataButton
                    secured={engagement.status}
                    redacted="You do not have permission to view the engagement's status"
                    onClick={() => openWorkflow(engagement)}
                    children={labelFrom(EngagementStatusLabels)}
                  />
                </Grid>
                <Grid item>
                  <DataButton
                    startIcon={<DateRange sx={{ color: 'info.main' }} />}
                    secured={engagement.dateRange}
                    redacted="You do not have permission to view start/end dates"
                    children={FormattedDateRange.orNull}
                    empty="Start - End"
                    onClick={() => show('dateRangeOverride')}
                  />
                </Grid>
                <Grid item>
                  <DataButton
                    secured={engagement.position}
                    empty="Enter Intern Position"
                    redacted="You do not have permission to view intern position"
                    children={labelFrom(InternshipPositionLabels)}
                    onClick={() => show('position')}
                  />
                </Grid>
                <Grid item>
                  <DataButton
                    secured={engagement.countryOfOrigin}
                    empty="Enter Country of Origin"
                    redacted="You do not have permission to view country of origin"
                    children={(location) => location.name.value}
                    onClick={() => show('countryOfOriginId')}
                  />
                </Grid>
              </Grid>
              <Grid item container spacing={3}>
                <Grid item xs={6}>
                  <FieldOverviewCard
                    title="Growth Plan Complete Date"
                    data={{
                      value: engagement.completeDate.value ? (
                        <FormattedDate date={engagement.completeDate.value} />
                      ) : undefined,
                    }}
                    icon={PlantIcon}
                    onClick={() => show('completeDate')}
                    onButtonClick={() => show('completeDate')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FieldOverviewCard
                    title="Disbursement Complete Date"
                    data={{
                      value: engagement.disbursementCompleteDate.value ? (
                        <FormattedDate
                          date={engagement.disbursementCompleteDate.value}
                        />
                      ) : undefined,
                    }}
                    icon={OptionsIcon}
                    onClick={() => show('disbursementCompleteDate')}
                    onButtonClick={() => show('disbursementCompleteDate')}
                  />
                </Grid>
                <Grid item container spacing={3} alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="h4">Growth Plan</Typography>
                  </Grid>
                </Grid>
                <Grid item container spacing={3} alignItems="center">
                  <FileActionsContextProvider>
                    <Grid item xs={6}>
                      <DefinedFileCard
                        label="Growth Plan"
                        parentId={engagement.id}
                        uploadMutationDocument={
                          UploadInternshipEngagementGrowthPlanDocument
                        }
                        resourceType="engagement"
                        securedFile={engagement.growthPlan}
                      />
                    </Grid>
                  </FileActionsContextProvider>
                </Grid>
                <Grid item xs={6}>
                  <MethodologiesCard
                    onClick={() => show('methodologies')}
                    data={engagement.methodologies}
                  />
                </Grid>
              </Grid>
              <Grid item container spacing={3}>
                <Grid item xs={6}>
                  <CeremonyCard {...engagement.ceremony} />
                </Grid>
                <MentorCard
                  data={engagement.mentor}
                  wrap={(node) => (
                    <Grid item xs={6}>
                      {node}
                    </Grid>
                  )}
                  onEdit={() => show('mentorId')}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <EditEngagementDialog
        {...editState}
        engagement={engagement}
        editFields={editField}
      />
      {workflowEngagement && (
        <EngagementWorkflowDialog
          {...workflowState}
          engagement={workflowEngagement}
        />
      )}
    </>
  );
};
