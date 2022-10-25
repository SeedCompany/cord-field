import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
  Skeleton,
} from '@mui/material';
import { extendSx } from '~/common';

export interface AvatarProps extends MuiAvatarProps {
  loading?: boolean;
}

export const Avatar = ({ loading, ...props }: AvatarProps) => {
  const { alt, src, srcSet, sizes, children, sx, ...rest } = props;
  return (
    <MuiAvatar
      {...(loading ? rest : props)}
      sx={[
        {
          backgroundColor: 'transparent',
        },
        !loading && {
          color: 'info.main',
          bgcolor: 'grey.200',
        },
        ...extendSx(sx),
      ]}
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
