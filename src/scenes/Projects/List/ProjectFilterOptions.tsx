import { Tooltip } from '@material-ui/core';
import { upperFirst } from 'lodash';
import * as React from 'react';
import {
  displayStatus,
  ProjectStatus,
  ProjectStatusList,
  ProjectType,
  ProjectTypeList,
  Sensitivity,
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
  withTransform,
} from '../../../hooks';

export const useProjectFilters = makeQueryHandler({
  status: withTransform(EnumListParam<ProjectStatus>(), {
    encode: (value, encoder) =>
      encoder(
        value?.map((s: ProjectStatus) =>
          s === 'InDevelopment' ? 'dev' : s.toLowerCase()
        )
      ),
    decode: (value, decoder) =>
      decoder(value)?.map(
        (s): ProjectStatus =>
          s.toLowerCase() === 'dev'
            ? 'InDevelopment'
            : (upperFirst(s) as ProjectStatus)
      ),
  }),
  sensitivity: withTransform(EnumListParam<Sensitivity>(), {
    encode: (value, encoder) =>
      encoder(value?.map((v: Sensitivity) => v.toLowerCase())),
    decode: (value, decoder) =>
      decoder(value)?.map((v) => upperFirst(v) as Sensitivity),
  }),
  type: EnumParam<ProjectType>(),
  onlyMultipleEngagements: withKey(withDefault(BooleanParam(), false), 'multi'),
  mine: withDefault(BooleanParam(), true),
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
      <SwitchField name="mine" label="Only Show My Projects" />
    </>
  );
};
