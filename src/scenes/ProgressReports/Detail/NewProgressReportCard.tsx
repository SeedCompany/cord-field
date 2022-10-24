import { Add as AddIcon } from '@mui/icons-material';
import { Avatar, Card, CardActionArea, Typography } from '@mui/material';
import { useProgressReportContext } from '../ProgressReportContext';
import { ProgressReportFragment } from './ProgressReportDetail.graphql';

interface Props {
  progressReport: ProgressReportFragment;
  label: string;
}

export const NewProgressReportCard = ({ progressReport, label }: Props) => {
  const { toggleProgressReportDrawer, setCurrentProgressReport } =
    useProgressReportContext();

  return (
    <Card
      sx={{
        flex: 1,
        position: 'relative',
      }}
    >
      <CardActionArea
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: theme.spacing(3, 4),
        })}
        onClick={() => {
          setCurrentProgressReport(progressReport);
          toggleProgressReportDrawer(true);
        }}
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
            Add {label}
          </Typography>
        </>
      </CardActionArea>
    </Card>
  );
};
