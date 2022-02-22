import { Button } from '@material-ui/core';
import React from 'react';
import { ProjectOverviewFragment } from '../../scenes/Projects/Overview/ProjectOverview.generated';
import {
  EditableProjectField,
  UpdateProjectDialog,
} from '../../scenes/Projects/Update';
import { Many } from '../../util';
import { useDialog } from '../Dialog';
import { ButtonLink } from '../Routing';

const ReportGuideAction = {
  SET_RANGE: 'SET_RANGE',
  ADD_MANAGING_PARTNER: 'ADD_MANAGING_PARTNER',
  SET_REPORT_FREQUENCY: 'SET_REPORT_FREQUENCY',
};

export const FinancialReportGuide = ({
  project,
}: {
  project: ProjectOverviewFragment;
}) => {
  const [editState, editField, fieldsBeingEdited] =
    useDialog<Many<EditableProjectField>>();
  let action;

  if (!project.mouRange.value.start || !project.mouRange.value.end) {
    action = ReportGuideAction.SET_RANGE;
  } else if (project.partnerships.items.length === 0) {
    action = ReportGuideAction.ADD_MANAGING_PARTNER;
  } else {
    action = ReportGuideAction.SET_REPORT_FREQUENCY;
  }
  return (
    <>
      {action === ReportGuideAction.SET_RANGE ? (
        <Button color="primary" onClick={() => editField('mouRange')}>
          Set date range
        </Button>
      ) : action === ReportGuideAction.ADD_MANAGING_PARTNER ? (
        <ButtonLink color="primary" to={'partnerships'}>
          Add managing partner
        </ButtonLink>
      ) : (
        <ButtonLink color="primary" to={'partnerships'}>
          Set reporting frequency
        </ButtonLink>
      )}
      <UpdateProjectDialog
        {...editState}
        project={project}
        editFields={fieldsBeingEdited}
      />
    </>
  );
};
