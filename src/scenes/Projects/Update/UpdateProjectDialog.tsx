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
  DisplayMarketingRegionFragment,
  ExtractStrict,
} from '~/common';
import { Link } from '~/components/Routing';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  CheckboxField,
  DateField,
  EnumField,
  SecuredField,
  SubmitError,
  TextField,
} from '../../../components/form';
import {
  LocationField,
  MarketingRegionField,
} from '../../../components/form/Lookup';
import { FieldRegionField } from '../../../components/form/Lookup/FieldRegion';
import { FormattedDate } from '../../../components/Formatters';
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
  | 'departmentId'
  | 'mouRange'
  | 'estimatedSubmission'
  | 'fieldRegion'
  | 'primaryLocation'
  | 'sensitivity'
  | 'marketingLocation'
  | 'marketingRegionOverride'
  | 'rev79ProjectId'
>;
export type ProjectFieldName = EditableProjectField | 'usesRev79';

interface ProjectFieldProps {
  props: {
    name: string;
  };
  project: ProjectOverviewFragment;
}

const fieldMapping: Record<
  ProjectFieldName,
  ComponentType<ProjectFieldProps>
> = {
  name: ({ props }) => <TextField {...props} label="Project Name" />,
  primaryLocation: ({ props }) => (
    <LocationField {...props} label="Primary Location" />
  ),
  fieldRegion: ({ props }) => (
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
  marketingLocation: ({ props }) => (
    <LocationField {...props} label="Marketing Location" />
  ),
  marketingRegionOverride: ({ props }) => (
    <MarketingRegionField {...props} label="Marketing Region" />
  ),
  rev79ProjectId: ({ props }) => (
    <TextField {...props} label="Rev79 Project ID" />
  ),
  usesRev79: ({ project }) => (
    <CheckboxField
      name="usesRev79"
      label="Uses Rev79"
      disabled={!project.usesRev79.canEdit}
    />
  ),
  departmentId: ({ props, project }) => {
    // deviate from canEdit=false standard UX, since this is tacked onto name edit
    if (!project.departmentId.canEdit) return null;
    return <TextField {...props} label="Department ID" />;
  },
};

type MarketingLocationValue = NonNullable<
  ProjectOverviewFragment['marketingLocation']['value']
>;

type UpdateProjectFormValues = Merge<
  UpdateProject,
  {
    primaryLocation?: DisplayLocationFragment | null;
    fieldRegion?: DisplayFieldRegionFragment | null;
    usesRev79?: boolean;
    marketingLocation?: MarketingLocationValue | null;
    marketingRegionOverride?: DisplayMarketingRegionFragment | null;
  }
>;

type UpdateProjectDialogProps = Except<
  DialogFormProps<UpdateProjectFormValues>,
  'onSubmit' | 'initialValues'
> & {
  project: ProjectOverviewFragment;
  editFields?: Many<ProjectFieldName>;
  planChangeId?: string;
};

export const UpdateProjectDialog = ({
  project,
  editFields: editFieldsProp,
  ...props
}: UpdateProjectDialogProps) => {
  const displayFieldsArray = useMemo(
    () => many(editFieldsProp ?? []) as ProjectFieldName[],
    [editFieldsProp]
  );

  const marketingLocation = project.marketingLocation.value;
  const marketingLocationDefaultMarketingRegion =
    marketingLocation?.defaultMarketingRegion.value;

  const [updateProject] = useMutation(UpdateProjectDocument);

  const initialValues = useMemo(() => {
    const fullInitialValuesFields: Except<UpdateProjectFormValues, 'id'> = {
      name: project.name.value,
      primaryLocation: project.primaryLocation.value,
      fieldRegion: project.fieldRegion.value,
      mouStart: project.mouRange.value.start,
      mouEnd: project.mouRange.value.end,
      estimatedSubmission: project.estimatedSubmission.value,
      sensitivity: project.sensitivity,
      marketingLocation,
      marketingRegionOverride:
        project.marketingRegionOverride.value ??
        marketingLocationDefaultMarketingRegion,
      departmentId: project.departmentId.value,
      ...(project.__typename === 'MomentumTranslationProject' && {
        rev79ProjectId: project.rev79ProjectId.value,
        usesRev79: Boolean(project.usesRev79.value),
      }),
    };

    // Filter out irrelevant initial values so they don't get added to the mutation
    const keys = displayFieldsArray.flatMap((field) =>
      field === 'mouRange' ? ['mouStart', 'mouEnd'] : field
    );
    const filteredInitialValuesFields = pick(fullInitialValuesFields, keys);

    return {
      id: project.id,
      ...filteredInitialValuesFields,
    };
  }, [
    project.name.value,
    project.primaryLocation.value,
    project.fieldRegion.value,
    project.mouRange.value.start,
    project.mouRange.value.end,
    project.estimatedSubmission.value,
    project.sensitivity,
    marketingLocation,
    marketingLocationDefaultMarketingRegion,
    project.marketingRegionOverride.value,
    project.id,
    project.departmentId.value,
    project.__typename,
    project.usesRev79.value,
    project.rev79ProjectId.value,
    displayFieldsArray,
  ]);

  return (
    <DialogForm<UpdateProjectFormValues>
      title="Update Project"
      closeLabel="Close"
      submitLabel="Save"
      {...props}
      // Only simple properties are changeset aware, relationships are not.
      changesetAware={displayFieldsArray.every(
        (field) => !field.endsWith('Id')
      )}
      initialValues={initialValues}
      validate={(values) => {
        const start = values.mouStart;
        const end = values.mouEnd;

        if (start && end && asDate(start) > asDate(end)) {
          return {
            mouStart: 'Start date should come before end date',
            mouEnd: 'End date should come after start date',
          };
        }

        return undefined;
      }}
      onSubmit={async (data, form) => {
        const { dirtyFields, modified } = form.getState();
        const {
          primaryLocation,
          fieldRegion,
          marketingLocation,
          marketingRegionOverride,
          ...inputData
        } = data;

        const userModifiedMarketingRegion = Boolean(
          modified?.marketingRegionOverride
        );

        const marketingRegionOverrideValue =
          dirtyFields.marketingRegionOverride || userModifiedMarketingRegion
            ? marketingRegionOverride?.id ?? null
            : dirtyFields.marketingLocation
            ? marketingLocation?.defaultMarketingRegion.value?.id ?? null
            : undefined;

        await updateProject({
          variables: {
            input: {
              ...inputData,
              primaryLocation: dirtyFields.primaryLocation
                ? primaryLocation?.id ?? null
                : undefined,
              fieldRegion: dirtyFields.fieldRegion
                ? fieldRegion?.id ?? null
                : undefined,
              marketingLocation: dirtyFields.marketingLocation
                ? marketingLocation?.id ?? null
                : undefined,
              marketingRegionOverride: marketingRegionOverrideValue,
              usesRev79: dirtyFields.usesRev79
                ? inputData.usesRev79
                : undefined,
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
            ...(points.has('start') ? { mouStart: ' ' } : {}),
            ...(points.has('end') ? { mouEnd: ' ' } : {}),
          };
        },
      }}
    >
      <SubmitError />
      {displayFieldsArray.map((name) => {
        const Field = fieldMapping[name];
        if (name === 'usesRev79' || name === 'sensitivity') {
          return <Field props={{ name }} project={project} key={name} />;
        }
        return (
          <SecuredField obj={project} name={name} key={name}>
            {(props) => <Field props={props} project={project} />}
          </SecuredField>
        );
      })}
    </DialogForm>
  );
};
