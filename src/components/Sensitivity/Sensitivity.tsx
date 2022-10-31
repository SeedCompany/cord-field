import { VerifiedUserOutlined } from '@mui/icons-material';
import { Box, Chip, Skeleton, Theme, Typography } from '@mui/material';
import { meanBy } from 'lodash';
import { Sensitivity as SensitivityType } from '~/api/schema.graphql';
import { StyleProps } from '~/common';

const possible: SensitivityType[] = ['Low', 'Medium', 'High'];
const avgLength = Math.round(meanBy(possible, (s) => s.length));

const sensitivityStyles = {
  Low: (theme: Theme) => ({
    backgroundColor: theme.palette.grey[400],
  }),
  Medium: (theme: Theme) => ({
    backgroundColor: theme.palette.warning.main,
  }),
  High: (theme: Theme) => ({
    backgroundColor: theme.palette.error.main,
  }),
};

export interface SensitivityProps extends StyleProps {
  value?: SensitivityType;
  loading?: boolean;
  className?: string;
}

export const Sensitivity = ({
  value,
  loading,
  className,
  sx,
}: SensitivityProps) => {
  return (
    <Box className={className} sx={sx}>
      <Box
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          marginBottom: theme.spacing(),
        })}
      >
        <VerifiedUserOutlined
          sx={{
            fontSize: 16,
            color: 'text.secondary',
            mr: '2px',
          }}
        />
        <Typography variant="body2">Sensitivity</Typography>
      </Box>
      <Chip
        sx={[
          {
            '& > .MuiChip-label': {
              borderRadius: 'inherit', // so it passes down to skeleton
            },
          },
          {
            borderRadius: '4px',
            color: 'white',
            backgroundColor: 'transparent',
            position: 'relative',
          },
          Boolean(!loading) && value ? sensitivityStyles[value] : {},
        ]}
        size="small"
        label={
          loading ? (
            <>
              <Box
                sx={{
                  width: `${avgLength}ch`,
                }}
              />
              <Skeleton
                variant="rectangular"
                sx={{
                  borderRadius: 'inherit',
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
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
