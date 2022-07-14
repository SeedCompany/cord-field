import { VerifiedUserOutlined } from '@mui/icons-material';
import { Chip, makeStyles, Skeleton, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import clsx from 'clsx';
import { meanBy } from 'lodash';
import { Sensitivity as SensitivityType } from '~/api/schema.graphql';

const possible: SensitivityType[] = ['Low', 'Medium', 'High'];
const avgLength = Math.round(meanBy(possible, (s) => s.length));

const useStyles = makeStyles(({ palette, spacing }) => ({
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: spacing(),
  },
  icon: {
    fontSize: 16,
    color: palette.text.secondary,
    marginRight: 2,
  },
  chip: {
    borderRadius: 4,
    color: 'white',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  chipLabel: {
    borderRadius: 'inherit', // so it passes down to skeleton
  },
  skeletonWidth: {
    width: `${avgLength}ch`,
  },
  skeleton: {
    borderRadius: 'inherit',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
  },
  Low: {
    backgroundColor: grey[400],
  },
  Medium: {
    backgroundColor: palette.warning.main,
  },
  High: {
    backgroundColor: palette.error.main,
  },
}));

export interface SensitivityProps {
  value?: SensitivityType;
  loading?: boolean;
  className?: string;
}

export const Sensitivity = ({
  value,
  loading,
  className,
}: SensitivityProps) => {
  const classes = useStyles();

  return (
    <div className={className}>
      <div className={classes.iconWrapper}>
        <VerifiedUserOutlined className={classes.icon} />
        <Typography variant="body2">Sensitivity</Typography>
      </div>
      <Chip
        classes={{ label: classes.chipLabel }}
        className={clsx(
          classes.chip,
          !loading && value ? classes[value] : null
        )}
        size="small"
        label={
          loading ? (
            <>
              <div className={classes.skeletonWidth} />
              <Skeleton variant="rectangular" className={classes.skeleton} />
            </>
          ) : (
            value
          )
        }
      />
    </div>
  );
};
