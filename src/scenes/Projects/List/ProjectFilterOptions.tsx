import { Tooltip } from '@mui/material';
import {
  ProjectStatusLabels,
  ProjectStatusList,
  ProjectTypeList,
  SensitivityList,
} from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import { EnumField, SwitchField } from '../../../components/form';
import {
  BooleanParam,
  EnumListParam,
  EnumParam,
  makeQueryHandler,
  withDefault,
  withKey,
} from '../../../hooks';

export const useProjectFilters = makeQueryHandler({
  status: EnumListParam(ProjectStatusList, { InDevelopment: 'dev' }),
  sensitivity: EnumListParam(SensitivityList),
  type: EnumParam(ProjectTypeList),
  onlyMultipleEngagements: withKey(BooleanParam(), 'multi'),
  tab: withDefault(EnumParam(['mine', 'all', 'pinned']), 'mine'),
});

export const ProjectFilterOptions = () => {
  return (
    <>
      <EnumField
        name="status"
        label="Status"
        multiple
        options={ProjectStatusList}
        getLabel={labelFrom(ProjectStatusLabels)}
        defaultOption="Show All"
        layout="two-column"
      />
      <EnumField
        name="sensitivity"
        label="Sensitivity"
        multiple
        options={SensitivityList}
        defaultOption="Show All"
        layout="two-column"
      />
      <EnumField
        name="type"
        label="Type"
        options={ProjectTypeList}
        defaultOption="Show All"
        layout="two-column"
      />
      <SwitchField
        name="onlyMultipleEngagements"
        label={
          <Tooltip title="Clusters/Cohorts are projects with multiple engagements">
            <span>Only Show Cluster/Cohort Projects</span>
          </Tooltip>
        }
        offIsNull
      />
    </>
  );
};
