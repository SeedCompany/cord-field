import { Tooltip } from '@material-ui/core';
import * as React from 'react';
import {
  displayStatus,
  ProjectStatusList,
  ProjectTypeList,
  SensitivityList,
} from '../../../api';
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
  onlyMultipleEngagements: withKey(withDefault(BooleanParam(), false), 'multi'),
  approvedInventory: withKey(withDefault(BooleanParam(), false), 'multi'),
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
        getLabel={displayStatus}
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
      />
      <SwitchField
        name="approvedInventory"
        label={
          <Tooltip title="">
            <span>Only show projects flagged as Approved Inventory</span>
          </Tooltip>
        }
      />
    </>
  );
};
