import { Add as AddIcon } from '@mui/icons-material';
import { Avatar, Card, CardActionArea, Typography } from '@mui/material';
import { useNavigate } from '~/components/Routing';

interface Props {
  label: string;
}

export const NewProgressReportCard = ({ label }: Props) => {
  const navigate = useNavigate();

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
          navigate('?edit=1');
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
