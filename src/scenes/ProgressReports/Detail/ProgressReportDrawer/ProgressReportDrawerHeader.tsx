import { ArrowBack } from '@mui/icons-material';
import { Box, Card, Divider, Skeleton, Theme, Typography } from '@mui/material';
import { Link } from '~/components/Routing';
import { SensitivityIcon } from '~/components/Sensitivity';
import { useProgressReportContext } from '../../ProgressReportContext';

export const ProgressReportDrawerHeader = () => {
  const { setCurrentProgressReport, currentReport } =
    useProgressReportContext();

  const language = currentReport?.parent.language;
  const project = currentReport?.parent.project;

  return (
    <Box
      sx={{
        display: 'flex',
        width: 1,
        flexDirection: 'column',
        padding: 2,
        pt: 0,
      }}
    >
      <Link
        to=".."
        sx={(theme: Theme) => ({
          color: theme.palette.grey[800],
          cursor: 'pointer',
          marginTop: -2,
          '&:hover': {
            textDecoration: 'underline',
          },
          marginBottom: 2,
        })}
        onClick={() => {
          setCurrentProgressReport(null);
        }}
      >
        <ArrowBack
          sx={{
            marginRight: 1,
            fontSize: '1.25rem',
            marginBottom: '-4px',
          }}
        />
        All Reports
      </Link>
      <div css={{ display: 'flex' }}>
        {currentReport ? (
          <Typography variant="h2">{project?.name.value}</Typography>
        ) : (
          <Skeleton variant="text" height={40} width={200} />
        )}
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 2, borderRightColor: 'black', borderRightWidth: 2 }}
        />
        {currentReport ? (
          <Typography variant="h2">
            {language?.value?.displayName.value}
          </Typography>
        ) : (
          <Skeleton variant="text" height={40} width={200} />
        )}
      </div>
      <Box
        sx={{
          marginTop: 1,
          display: 'flex',
          flexDirection: 'row',
          '& > *': {
            marginRight: 2,
          },
        }}
      >
        <Card elevation={0} variant="outlined" sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.gray">
            Location
          </Typography>
          {language?.value?.locations.items.map((loc) => (
            <Typography variant="body1" key={loc.id}>
              {loc.name.value}
            </Typography>
          ))}

          {!currentReport && (
            <Skeleton variant="text" height={20} width={200} />
          )}
        </Card>
        <Card elevation={0} variant="outlined" sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.gray">
            Sensitivity
          </Typography>
          <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>
            {language?.value?.sensitivity}
            <SensitivityIcon
              value={language?.value?.sensitivity}
              sx={{
                height: 16,
              }}
            />
          </Typography>
        </Card>
      </Box>
    </Box>
  );
};
