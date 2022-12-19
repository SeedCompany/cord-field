import { Add as AddIcon } from '@mui/icons-material';
import { Avatar, Card, Typography } from '@mui/material';
import { CardActionAreaLink } from '~/components/Routing';
import { ProgressReportEditFragment } from '../EditForm/ProgressReportEdit.graphql';

interface Props {
  report: ProgressReportEditFragment;
}

export const NewProgressReportCard = ({ report }: Props) => {
  const preStatus = report.status.value === 'NotStarted' ? 'Start' : 'Edit';

  return (
    <Card
      sx={{
        flex: 1,
        position: 'relative',
      }}
    >
      <CardActionAreaLink
        to="edit"
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
            <AddIcon fontSize="large" />
          </Avatar>
          <Typography
            align="center"
            sx={{
              marginTop: 1,
            }}
          >
            {preStatus} {report.type} Report
          </Typography>
        </>
      </CardActionAreaLink>
    </Card>
  );
};
