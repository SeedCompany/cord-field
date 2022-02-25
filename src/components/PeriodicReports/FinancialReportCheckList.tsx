import { Checkbox, FormControl, FormControlLabel } from '@material-ui/core';
import React from 'react';
import {
  FinancialReportsQuery,
  NarrativeReportsQuery,
} from '../../scenes/Projects/Reports/ProjectReports.generated';

const ReportGuideAction = {
  SET_RANGE: 'SET_RANGE',
  ADD_MANAGING_PARTNER: 'ADD_MANAGING_PARTNER',
  SET_REPORT_FREQUENCY: 'SET_REPORT_FREQUENCY',
};

export const FinancialReportCheckList = ({
  data: { project },
}: {
  data: FinancialReportsQuery | NarrativeReportsQuery;
}) => {
  const checkList = Object.keys(ReportGuideAction).map((action) => {
    switch (action) {
      case ReportGuideAction.SET_RANGE:
        return {
          label: `Define the project's date range`,
          checked:
            !!project.mouRange.value.start && !!project.mouRange.value.end,
        };
      case ReportGuideAction.ADD_MANAGING_PARTNER:
        return {
          label: 'Add a managing partner',
          checked: project.partnerships.items.length > 0,
        };
      default:
        return {
          label: `Set the managing partner's reporting frequency`,
          checked: !!project.financialReportPeriod.value,
        };
    }
  });
  return (
    <>
      {checkList.map((item, index) => (
        <FormControl key={`check-list-${index}`} fullWidth>
          <FormControlLabel
            label={item.label}
            control={
              <Checkbox
                name={`check-list-${index}`}
                checked={item.checked}
                disabled
              />
            }
          />
        </FormControl>
      ))}
    </>
  );
};
