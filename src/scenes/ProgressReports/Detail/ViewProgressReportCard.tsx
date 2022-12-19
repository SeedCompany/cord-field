import { AssignmentOutlined } from '@mui/icons-material';
import { Avatar, Card, Typography } from '@mui/material';
import { CardActionAreaLink } from '~/components/Routing';
import { ProgressReportEditFragment } from '../EditForm/ProgressReportEdit.graphql';

interface Props {
  report: ProgressReportEditFragment;
}

export const ViewProgressReportCard = ({ report }: Props) => {
  return (
    <Card
      sx={{
        flex: 1,
        position: 'relative',
      }}
    >
      <CardActionAreaLink
        to="view"
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: theme.spacing(3, 4),
        })}
      >
        <>
          <Avatar
            sx={{
              width: 58,
              height: 58,
            }}
          >
            <AssignmentOutlined fontSize="large" />
          </Avatar>
          <Typography
            align="center"
            sx={{
              marginTop: 1,
            }}
          >
            View {report.type} Report
          </Typography>
        </>
      </CardActionAreaLink>
    </Card>
  );
};
