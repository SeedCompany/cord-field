import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { GtlReportStatusLabels } from '~/api/schema/enumLists';
import { labelFrom } from '~/common';
import { FormattedDate } from '../../../components/Formatters';
import { ReportLabel } from '../../../components/PeriodicReports/ReportLabel';
import { Link } from '../../../components/Routing';
import { type GtlReportsOfEngagementQuery } from './GtlReportsOfEngagement.graphql';

type Engagement = Extract<
  GtlReportsOfEngagementQuery['engagement'],
  { __typename?: 'InternshipEngagement' }
>;
type Row = Engagement['gtlReports']['items'][number];

export const GtlReportsTable = ({
  rows,
  loading,
}: {
  rows: readonly Row[];
  loading: boolean;
}) => (
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell>Period</TableCell>
        <TableCell>Due</TableCell>
        <TableCell>Status</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {loading &&
        Array.from({ length: 4 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell colSpan={3}>
              <Skeleton />
            </TableCell>
          </TableRow>
        ))}

      {!loading && rows.length === 0 && (
        <TableRow>
          <TableCell colSpan={3}>
            <Typography variant="body2" color="text.secondary">
              No reports yet. They are generated from the engagement’s date
              range.
            </Typography>
          </TableCell>
        </TableRow>
      )}

      {rows.map((report) => (
        <TableRow key={report.id} hover>
          <TableCell>
            <Link to={`/gtl-reports/${report.id}`}>
              <ReportLabel report={report} />
            </Link>
          </TableCell>
          <TableCell>
            <FormattedDate date={report.due} />
          </TableCell>
          <TableCell>
            {report.status.value
              ? labelFrom(GtlReportStatusLabels)(report.status.value)
              : '—'}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
