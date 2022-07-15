import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
  Skeleton,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

export interface AvatarProps extends MuiAvatarProps {
  loading?: boolean;
}

const useStyles = makeStyles()(() => ({
  loading: {
    backgroundColor: 'transparent',
  },
  skeleton: {
    width: '100%',
    height: '100%',
  },
}));

export const Avatar = ({ loading, ...props }: AvatarProps) => {
  const { alt, src, srcSet, sizes, children, ...rest } = props;
  const { classes } = useStyles();
  return (
    <MuiAvatar
      {...(loading ? rest : props)}
      classes={{
        ...props.classes,
        colorDefault: loading ? classes.loading : props.classes?.colorDefault,
      }}
    >
      {loading ? (
        <Skeleton variant="rectangular" className={classes.skeleton} />
      ) : (
        children
      )}
    </MuiAvatar>
  );
};
