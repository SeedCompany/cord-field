import { Box } from '@material-ui/core';
import * as React from 'react';
import { ProjectStatus, Sensitivity } from '../../../api';
import { displayStatus } from '../../../api/displayStatus';
import { CheckboxesField, CheckboxOption } from '../../../components/form';
import { SwitchField } from '../../../components/form/SwitchField';

export interface ProjectFilterValues {
  status: ProjectStatus[];
  sensitivity: Sensitivity[];
  clusters: boolean;
}

export const ProjectFilterOptions = () => {
  return (
    <>
      <CheckboxesField name="status" label="Status" row>
        <Box width="50%">
          <CheckboxOption label="Show All" default />
        </Box>
        {([
          'Pending',
          'Suspended',
          'InDevelopment',
          'Finished',
          'Active',
        ] as ProjectStatus[]).map((status: ProjectStatus) => (
          <Box width="50%" key={status}>
            <CheckboxOption
              key={status}
              label={displayStatus(status)}
              value={status}
            />
          </Box>
        ))}
      </CheckboxesField>
      <CheckboxesField name="sensitivity" label="Sensitivity" row>
        <Box width="50%">
          <CheckboxOption label="Show All" default />
        </Box>
        {(['Low', 'Medium', 'High'] as Sensitivity[]).map(
          (sensitivity: Sensitivity) => (
            <Box width="50%" key={sensitivity}>
              <CheckboxOption label={sensitivity} value={sensitivity} />
            </Box>
          )
        )}
      </CheckboxesField>
      <SwitchField name="clusters" label="Only Show Cluster Projects" />
    </>
  );
};
