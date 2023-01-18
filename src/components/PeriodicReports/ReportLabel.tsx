import { CalendarDate, isSecured, Nullable, SecuredProp } from '~/common';
import { Redacted } from '../Redacted';
import { PeriodicReportFragment } from './PeriodicReport.graphql';

type Report = Pick<PeriodicReportFragment, 'start' | 'end'>;

export const ReportLabel = ({
  report,
}: {
  report: SecuredProp<Report> | Nullable<Report>;
}) => {
  let rep: Nullable<Report>;
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
  return (
    <span css={{ whiteSpace: 'nowrap' }}>{getLabel(rep.start, rep.end)}</span>
  );
};

const getLabel = (start: CalendarDate, end: CalendarDate) =>
  +start === +end
    ? 'Final'
    : start.hasSame(end, 'month')
    ? start.toFormat('LLLL yyyy')
    : `Q${start.fiscalQuarter} FY${start.fiscalYear}`;
