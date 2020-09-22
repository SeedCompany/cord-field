import { Grid, Tooltip } from '@material-ui/core';
import { upperFirst } from 'lodash';
import * as React from 'react';
import {
  displayStatus,
  ProjectStatus,
  ProjectStatusList,
  Sensitivity,
  SensitivityList,
} from '../../../api';
import { CheckboxesField, CheckboxOption } from '../../../components/form';
import { SwitchField } from '../../../components/form/SwitchField';
import {
  BooleanParam,
  EnumListParam,
  makeQueryHandler,
  withDefault,
  withKey,
  withTransform,
} from '../../../hooks';

export const useProjectFilters = makeQueryHandler({
  status: EnumListParam<ProjectStatus>(),
  sensitivity: withTransform(EnumListParam<Sensitivity>(), {
    encode: (value, encoder) =>
      encoder(value?.map((v: Sensitivity) => v.toLowerCase())),
    decode: (value, decoder) =>
      decoder(value)?.map((v) => upperFirst(v) as Sensitivity),
  }),
  onlyMultipleEngagements: withKey(withDefault(BooleanParam(), false), 'multi'),
});

export const ProjectFilterOptions = () => {
  return (
    <>
      <CheckboxesField name="status" label="Status" row>
        <Grid container>
          <Grid item xs={6}>
            <CheckboxOption label="Show All" default />
          </Grid>
          {ProjectStatusList.map((status) => (
            <Grid item xs={6} key={status}>
              <CheckboxOption
                key={status}
                label={displayStatus(status)}
                value={status}
              />
            </Grid>
          ))}
        </Grid>
      </CheckboxesField>
      <CheckboxesField name="sensitivity" label="Sensitivity" row>
        <Grid container>
          <Grid item xs={6}>
            <CheckboxOption label="Show All" default />
          </Grid>
          {SensitivityList.map((sensitivity) => (
            <Grid item xs={6} key={sensitivity}>
              <CheckboxOption label={sensitivity} value={sensitivity} />
            </Grid>
          ))}
        </Grid>
      </CheckboxesField>
      <SwitchField
        name="onlyMultipleEngagements"
        label={
          <Tooltip title="Clusters/Cohorts are projects with multiple engagements">
            <span>Only Show Cluster/Cohort Projects</span>
          </Tooltip>
        }
      />
    </>
  );
};
