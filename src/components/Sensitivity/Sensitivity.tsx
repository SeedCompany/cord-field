import { VerifiedUserOutlined } from '@mui/icons-material';
import { Box, Chip, Skeleton, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import { meanBy } from 'lodash';
import { Sensitivity as SensitivityType } from '~/api/schema.graphql';
import { extendSx, StyleProps } from '~/common/sx';

const possible: SensitivityType[] = ['Low', 'Medium', 'High'];
const avgLength = Math.round(meanBy(possible, (s) => s.length));

export interface SensitivityProps {
  value?: SensitivityType;
  loading?: boolean;
}

export const Sensitivity = ({
  value,
  loading,
  sx,
  className,
}: SensitivityProps & StyleProps) => {
  const theme = useTheme();

  const sensitivityColors = {
    Low: grey[400],
    Medium: theme.palette.warning.main,
    High: theme.palette.error.main,
  } as const;

  return (
    <Box className={className} sx={extendSx(sx)}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <VerifiedUserOutlined
          sx={(theme) => ({
            fontSize: 16,
            color: theme.palette.text.secondary,
            mr: '2px',
          })}
        />
        <Typography variant="body2">Sensitivity</Typography>
      </Box>
      <Chip
        size="small"
        sx={{
          borderRadius: 1,
          color: 'white',
          backgroundColor: !loading && value ? sensitivityColors[value] : null,
          position: 'relative',
          '& .MuiChip-label': {
            borderRadius: 'inherit',
          },
        }}
        label={
          loading ? (
            <>
              <div
                style={{
                  width: `${avgLength}ch`,
                }}
              />
              <Skeleton
                variant="rectangular"
                sx={{
                  borderRadius: 'inherit',
                  position: 'absolute',
                  inset: 0,
                  height: '100%',
                  width: '100%',
                }}
              />
            </>
          ) : (
            value
          )
        }
      />
    </Box>
  );
};
