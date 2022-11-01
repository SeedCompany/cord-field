import { Add as AddIcon } from '@mui/icons-material';
import { Avatar, Card, Typography } from '@mui/material';
import { CardActionAreaLink } from '~/components/Routing';

interface Props {
  label: string;
}

export const NewProgressReportCard = ({ label }: Props) => {
  return (
    <Card sx={{ flex: 1, position: 'relative' }}>
      <CardActionAreaLink
        to="edit"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          py: 3,
          px: 4,
        }}
      >
        <>
          <Avatar sx={{ width: 58, height: 58 }}>
            <AddIcon fontSize="large" />
          </Avatar>
          <Typography align="center" sx={{ mt: 1 }}>
            Add {label}
          </Typography>
        </>
      </CardActionAreaLink>
    </Card>
  );
};
