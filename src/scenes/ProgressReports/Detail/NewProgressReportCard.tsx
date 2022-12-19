import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { Avatar, Card, Typography } from '@mui/material';
import { CardActionAreaLink } from '~/components/Routing';
import { ProgressReportEditFragment } from '../EditForm/ProgressReportEdit.graphql';

interface Props {
  report: ProgressReportEditFragment;
}

export const NewProgressReportCard = ({ report }: Props) => {
  const isStarted = report.status.value !== 'NotStarted';
  const preStatus = isStarted ? 'Edit' : 'Start';

  const Icon = isStarted ? (
    <EditIcon fontSize="large" />
  ) : (
    <AddIcon fontSize="large" />
  );

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
            {Icon}
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
