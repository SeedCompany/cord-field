import { useMutation } from '@apollo/client';
import { Box, Stack, Typography } from '@mui/material';
import { groupBy, many, Many } from '@seedcompany/common';
import { FORM_ERROR } from 'final-form';
import { pick } from 'lodash';
import { ComponentType, useMemo } from 'react';
import { Except, Merge } from 'type-fest';
import { invalidateProps } from '~/api';
import { SensitivityList, UpdateProject } from '~/api/schema.graphql';
import {
  asDate,
  CalendarDate,
  DisplayFieldRegionFragment,
  DisplayLocationFragment,
  ExtractStrict,
} from '~/common';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  DateField,
  EnumField,
  FieldGroup,
  SecuredField,
  SubmitError,
  TextField,
} from '../../../components/form';
import { LocationField } from '../../../components/form/Lookup';
import { FieldRegionField } from '../../../components/form/Lookup/FieldRegion';
import { FormattedDate } from '../../../components/Formatters';
import { Link } from '../../../components/Routing';
import {
  updateEngagementDateRanges,
  updatePartnershipsDateRanges,
} from '../DateRangeCache';
import { ProjectOverviewFragment } from '../Overview/ProjectOverview.graphql';
import { UpdateProjectDocument } from './UpdateProject.graphql';

export type EditableProjectField = ExtractStrict<
  keyof UpdateProject | 'mouRange',
  // Add more fields here as needed
  | 'name'
  | 'mouRange'
  | 'estimatedSubmission'
  | 'fieldRegionId'
  | 'primaryLocationId'
  | 'sensitivity'
  | 'marketingLocationId'
>;

interface ProjectFieldProps {
  props: {
    name: string;
  };
  project: ProjectOverviewFragment;
}

const fieldMapping: Record<
  EditableProjectField,
  ComponentType<ProjectFieldProps>
> = {
  name: ({ props }) => <TextField {...props} label="Project Name" />,
  primaryLocationId: ({ props }) => (
    <LocationField {...props} label="Primary Location" />
  ),
  fieldRegionId: ({ props }) => (
    <FieldRegionField {...props} label="Field Region" />
  ),
  mouRange: ({ props }) => (
    <>
      <DateField {...props} name="mouStart" label="Start Date" />
      <DateField {...props} name="mouEnd" label="End Date" />
    </>
  ),
  estimatedSubmission: ({ props }) => (
    <DateField {...props} label="Estimated Submission Date" />
  ),
  sensitivity: ({ props }) => (
    <EnumField {...props} label="Sensitivity" options={SensitivityList} />
  ),
  marketingLocationId: ({ props }) => (
    <LocationField {...props} label="Marketing Location" />
  ),
};

interface UpdateProjectFormValues {
  project: Merge<
    UpdateProject,
    {
      primaryLocationId?: DisplayLocationFragment | null;
      fieldRegionId?: DisplayFieldRegionFragment | null;
      marketingLocationId?: DisplayLocationFragment | null;
    }
  >;
}

type UpdateProjectDialogProps = Except<
  DialogFormProps<UpdateProjectFormValues>,
  'onSubmit' | 'initialValues'
> & {
  project: ProjectOverviewFragment;
  editFields?: Many<EditableProjectField>;
  planChangeId?: string;
};

export const UpdateProjectDialog = ({
  project,
  editFields: editFieldsProp,
  ...props
}: UpdateProjectDialogProps) => {
  const editFields = useMemo(
    () => many(editFieldsProp ?? []),
    [editFieldsProp]
  );

  const [updateProject] = useMutation(UpdateProjectDocument);

  const initialValues = useMemo(() => {
    const fullInitialValuesFields: Except<
      UpdateProjectFormValues['project'],
      'id'
    > = {
      name: project.name.value,
      primaryLocationId: project.primaryLocation.value,
      fieldRegionId: project.fieldRegion.value,
      mouStart: project.mouRange.value.start,
      mouEnd: project.mouRange.value.end,
      estimatedSubmission: project.estimatedSubmission.value,
      sensitivity: project.sensitivity,
      marketingLocationId: project.marketingLocation.value,
    };

    // Filter out irrelevant initial values so they don't get added to the mutation
    const filteredInitialValuesFields = pick(
      fullInitialValuesFields,
      editFields.flatMap((field) =>
        field === 'mouRange' ? ['mouStart', 'mouEnd'] : field
      )
    );

    return {
      project: {
        id: project.id,
        ...filteredInitialValuesFields,
      },
    };
  }, [
    project.name.value,
    project.primaryLocation.value,
    project.fieldRegion.value,
    project.mouRange.value.start,
    project.mouRange.value.end,
    project.estimatedSubmission.value,
    project.sensitivity,
    project.marketingLocation.value,
    project.id,
    editFields,
  ]);

  return (
    <DialogForm<UpdateProjectFormValues>
      title="Update Project"
      closeLabel="Close"
      submitLabel="Save"
      {...props}
      // Only simple properties are changeset aware, relationships are not.
      changesetAware={editFields.every((field) => !field.endsWith('Id'))}
      initialValues={initialValues}
      validate={(values) => {
        const start = values.project.mouStart;
        const end = values.project.mouEnd;

        if (start && end && asDate(start) > asDate(end)) {
          return {
            project: {
              mouStart: 'Start date should come before end date',
              mouEnd: 'End date should come after start date',
            },
          };
        }

        return undefined;
      }}
      onSubmit={async ({ project: data }, form) => {
        const { dirtyFields } = form.getState();
        await updateProject({
          variables: {
            input: {
              project: {
                ...data,
                primaryLocationId: dirtyFields['project.primaryLocationId']
                  ? data.primaryLocationId?.id ?? null
                  : undefined,
                fieldRegionId: dirtyFields['project.fieldRegionId']
                  ? data.fieldRegionId?.id ?? null
                  : undefined,
                marketingLocationId: dirtyFields['project.marketingLocationId']
                  ? data.marketingLocationId?.id ?? null
                  : undefined,
              },
              changeset: project.changeset?.id,
            },
          },
          update: (cache) => {
            if (data.mouStart === undefined && data.mouEnd === undefined) {
              return;
            }

            // Project date range affects budget records, remove them so
            // they are re-fetched when needed
            if (project.budget.value) {
              invalidateProps(cache, project.budget.value, 'records');
            }

            invalidateProps(cache, project, [
              'narrativeReports',
              'financialReports',
            ]);

            // Adjust cached date ranges of engagements & partnerships
            // since they are based on the project's date range
            updateEngagementDateRanges(cache, project);
            updatePartnershipsDateRanges(cache, project);
          },
        });
      }}
      errorHandlers={{
        DateOverrideConflict: ({ conflicts, object }) => {
          const rendered = (
            <Stack gap={2}>
              {groupBy(conflicts, (conflict) => conflict.__typename).map(
                (conflicts) => {
                  const type = conflicts[0].__typename;
                  const labels =
                    type === 'Partnership'
                      ? (['A partnership', 'Some partnerships'] as const)
                      : type.endsWith('Engagement')
                      ? (['An engagement', 'Some engagements'] as const)
                      : (['An object', 'Some objects'] as const);
                  const getUrl =
                    type === 'Partnership'
                      ? () => `/projects/${object.id}/partnerships`
                      : type.endsWith('Engagement')
                      ? (id: string) => `/engagements/${id}`
                      : null;
                  return (
                    <div key={type}>
                      <Typography variant="body2" gutterBottom>
                        {conflicts.length === 1
                          ? `${labels[0]} has a date outside the new range`
                          : `${labels[1]} have dates outside the new range`}
                      </Typography>
                      <Box component="ul" sx={{ m: 0, paddingInlineStart: 4 }}>
                        {conflicts.map((conflict) => (
                          <li key={conflict.id + conflict.point}>
                            {conflict.point === 'start' ? 'Start' : 'End'} date
                            of{' '}
                            {getUrl ? (
                              <Link to={getUrl(conflict.id)} color="inherit">
                                {conflict.label}
                              </Link>
                            ) : (
                              conflict.label
                            )}{' '}
                            is{' '}
                            <FormattedDate
                              date={CalendarDate.fromISO(conflict.date)}
                            />
                          </li>
                        ))}
                      </Box>
                    </div>
                  );
                }
              )}
            </Stack>
          );
          const points = new Set(conflicts.map((conflict) => conflict.point));
          return {
            [FORM_ERROR]: rendered,
            // Mark the field(s) as invalid,
            // even though we show the error in the unified spot.
            project: {
              ...(points.has('start') ? { mouStart: ' ' } : {}),
              ...(points.has('end') ? { mouEnd: ' ' } : {}),
            },
          };
        },
      }}
    >
      <SubmitError />
      <FieldGroup prefix="project">
        {editFields.map((name) => {
          const Field = fieldMapping[name];
          if (name === 'sensitivity') {
            return <Field props={{ name }} project={project} key={name} />;
          }
          return (
            <SecuredField obj={project} name={name} key={name}>
              {(props) => <Field props={props} project={project} />}
            </SecuredField>
          );
        })}
      </FieldGroup>
    </DialogForm>
  );
};
