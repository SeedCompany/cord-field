import { Add as AddIcon } from '@mui/icons-material';
import { Avatar, Card, Typography } from '@mui/material';
import { CardActionAreaLink } from '~/components/Routing';

interface Props {
  label: string;
}

export const NewProgressReportCard = ({ label }: Props) => {
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
            Edit {label}
          </Typography>
        </>
      </CardActionAreaLink>
    </Card>
  );
};
