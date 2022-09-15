import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
  Skeleton,
} from '@mui/material';

export interface AvatarProps extends MuiAvatarProps {
  loading?: boolean;
}

export const Avatar = ({ loading, ...props }: AvatarProps) => {
  const { alt, src, srcSet, sizes, children, ...rest } = props;
  return (
    <MuiAvatar
      {...(loading ? rest : props)}
      sx={
        loading
          ? {
              backgroundColor: 'transparent',
            }
          : undefined // setting to undefined will make it fallback to the default
      }
      classes={props.classes}
    >
      {loading ? (
        <Skeleton
          variant="rectangular"
          sx={{
            width: '100%',
            height: '100%',
          }}
        />
      ) : (
        children
      )}
    </MuiAvatar>
  );
};
