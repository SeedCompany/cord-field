import {
  makeStyles,
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

export interface AvatarProps extends MuiAvatarProps {
  loading?: boolean;
}

const useStyles = makeStyles(() => ({
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
  const classes = useStyles();
  return (
    <MuiAvatar
      {...(loading ? rest : props)}
      classes={{
        ...props.classes,
        colorDefault: loading ? classes.loading : props.classes?.colorDefault,
      }}
    >
      {loading ? (
        <Skeleton variant="rect" className={classes.skeleton} />
      ) : (
        children
      )}
    </MuiAvatar>
  );
};
