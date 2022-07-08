import React from 'react';
import { isSecured } from '~/api';
import { CalendarDate, Nullable } from '~/common';
import { Redacted } from '../Redacted';
import {
  PeriodicReportFragment,
  SecuredPeriodicReportFragment,
} from './PeriodicReport.graphql';

export const ReportLabel = ({
  report,
}: {
  report: SecuredPeriodicReportFragment | Nullable<PeriodicReportFragment>;
}) => {
  let rep: Nullable<PeriodicReportFragment>;
  if (isSecured(report)) {
    if (!report.canRead) {
      return <Redacted info="You cannot view this report" width="100%" />;
    }
    rep = report.value;
  } else {
    rep = report;
  }

  if (!rep) {
    return null;
  }
  return <>{getLabel(rep.start, rep.end)}</>;
};

const getLabel = (start: CalendarDate, end: CalendarDate) =>
  +start === +end
    ? 'Final'
    : start.hasSame(end, 'month')
    ? start.toFormat('LLLL yyyy')
    : `Q${start.fiscalQuarter} FY${start.fiscalYear}`;
