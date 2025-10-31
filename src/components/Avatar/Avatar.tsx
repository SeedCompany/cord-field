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
      sx={{
        ...(loading && { backgroundColor: 'transparent' }),
        ...props.sx,
      }}
      {...(loading ? rest : props)}
    >
      {loading ? (
        <Skeleton
          variant="rectangular"
          sx={{ width: '100%', height: '100%' }}
        />
      ) : (
        children
      )}
    </MuiAvatar>
  );
};
