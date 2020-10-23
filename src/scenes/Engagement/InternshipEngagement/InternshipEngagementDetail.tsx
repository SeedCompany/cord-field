import { Grid, makeStyles, Typography } from '@material-ui/core';
import { ChatOutlined, DateRange } from '@material-ui/icons';
import React, { FC } from 'react';
import {
  displayEngagementStatus,
  displayInternPosition,
  securedDateRange,
} from '../../../api';
import { AddItemCard } from '../../../components/AddItemCard';
import { DataButton } from '../../../components/DataButton';
import { DefinedFileCard } from '../../../components/DefinedFileCard';
import { useDialog } from '../../../components/Dialog';
import { FieldOverviewCard } from '../../../components/FieldOverviewCard';
import { FileActionsContextProvider } from '../../../components/files/FileActions';
import {
  useDateFormatter,
  useDateTimeFormatter,
} from '../../../components/Formatters';
import { OptionsIcon, PlantIcon } from '../../../components/Icons';
import { ContentContainer as Content } from '../../../components/Layout';
import { MethodologiesCard } from '../../../components/MethodologiesCard';
import { ProjectDetailNavigation } from '../../../components/ProjectDetailNavigation';
import { Redacted } from '../../../components/Redacted';
import { Link } from '../../../components/Routing';
import { Many } from '../../../util';
import { CeremonyCard } from '../CeremonyCard';
import {
  EditableEngagementField,
  EditEngagementDialog,
} from '../EditEngagement/EditEngagementDialog';
import { EngagementQuery } from '../Engagement.generated';
import { useUploadEngagementFile } from '../Files';
import { MentorCard } from './MentorCard';

const useStyles = makeStyles(({ breakpoints, palette, typography }) => ({
  main: {
    flexWrap: 'nowrap',
    maxWidth: breakpoints.values.md,
    overflowY: 'scroll',
  },
  nameRedacted: {
    width: '50%',
  },
  infoColor: {
    color: palette.info.main,
  },
  dropzoneText: {
    fontSize: typography.h2.fontSize,
  },
}));

export const InternshipEngagementDetail: FC<EngagementQuery> = ({
  project,
  engagement,
}) => {
  const classes = useStyles();
  const uploadFile = useUploadEngagementFile('internship');

  const [editState, show, editField] = useDialog<
    Many<EditableEngagementField>
  >();

  const date = securedDateRange(engagement.startDate, engagement.endDate);
  const formatDate = useDateFormatter();
  const formatDateTime = useDateTimeFormatter();

  if (engagement.__typename !== 'InternshipEngagement') {
    return null; // easiest for typescript
  }

  const intern = engagement.intern.value;
  const name = intern?.fullName;
  const growthPlan = engagement.growthPlan;

  return (
    <>
      <Content>
        <Grid
          component="main"
          container
          direction="column"
          spacing={3}
          className={classes.main}
        >
          <Grid item>
            <ProjectDetailNavigation
              project={project}
              title={
                name ?? (
                  <Redacted
                    info="You do not have permission to view this engagement's name"
                    width={200}
                  />
                )
              }
            />
          </Grid>

          <Grid item container spacing={3} alignItems="center">
            <Grid item container spacing={3} alignItems="center">
              <Grid item container spacing={3} alignItems="center">
                <Grid item className={name ? undefined : classes.nameRedacted}>
                  <Typography
                    variant="h2"
                    {...(intern
                      ? { component: Link, to: `/users/${intern.id}` }
                      : {})}
                  >
                    {name ?? (
                      <Redacted
                        info={`You do not have permission to view this engagement's ${
                          intern ? 'name' : 'intern'
                        }`}
                        width="100%"
                      />
                    )}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container spacing={3} alignItems="center">
                <Grid item>
                  <Typography variant="h4">Internship Engagement</Typography>
                </Grid>

                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    Updated {formatDateTime(engagement.modifiedAt)}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container spacing={1} alignItems="center">
                <Grid item>
                  <DataButton
                    secured={engagement.position}
                    empty="Enter Intern Position"
                    redacted="You do not have permission to view intern position"
                    children={displayInternPosition}
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
                <Grid item>
                  <DataButton
                    startIcon={<DateRange className={classes.infoColor} />}
                    secured={date}
                    redacted="You do not have permission to view start/end dates"
                    children={formatDate.range}
                    empty="Start - End"
                    onClick={() =>
                      show(['startDateOverride', 'endDateOverride'])
                    }
                  />
                </Grid>
                <Grid item>
                  <DataButton onClick={() => show('status')}>
                    {displayEngagementStatus(engagement.status)}
                  </DataButton>
                </Grid>
              </Grid>
              <Grid item container spacing={3}>
                <Grid item xs={6}>
                  <FieldOverviewCard
                    title="Growth Plan Complete Date"
                    data={{
                      value: formatDate(engagement.completeDate.value),
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
                      value: formatDate(
                        engagement.disbursementCompleteDate.value
                      ),
                    }}
                    icon={OptionsIcon}
                    onClick={() => show('disbursementCompleteDate')}
                    onButtonClick={() => show('disbursementCompleteDate')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FieldOverviewCard
                    title="Communications Complete Date"
                    data={{
                      value: formatDate(
                        engagement.communicationsCompleteDate.value
                      ),
                    }}
                    icon={ChatOutlined}
                    onClick={() => show('communicationsCompleteDate')}
                    onButtonClick={() => show('communicationsCompleteDate')}
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
                      {growthPlan.canRead && !growthPlan.value ? (
                        <AddItemCard
                          actionType="dropzone"
                          canAdd={growthPlan.canEdit}
                          DropzoneProps={{
                            classes: { text: classes.dropzoneText },
                            options: {
                              multiple: false,
                            },
                          }}
                          handleFileSelect={(files: File[]) =>
                            uploadFile({ files, parentId: engagement.id })
                          }
                          itemType="Growth Plan"
                        />
                      ) : (
                        <DefinedFileCard
                          onVersionUpload={(files) =>
                            uploadFile({
                              action: 'version',
                              files,
                              parentId: engagement.id,
                            })
                          }
                          resourceType="engagement"
                          securedFile={engagement.growthPlan}
                        />
                      )}
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
      </Content>
      <EditEngagementDialog
        {...editState}
        engagement={engagement}
        editFields={editField}
      />
    </>
  );
};
