import { Chip, ChipProps, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import { Except, SetRequired } from 'type-fest';
import { SecuredProp } from '~/common';
import { Redacted } from '../Redacted';

export interface BooleanPropertyProps extends SetRequired<ChipProps, 'label'> {
  redacted: string;
  data?: Except<SecuredProp<boolean>, 'canEdit'>;
  wrap?: (node: ReactElement) => ReactElement;
}

const StyledChip = styled(Chip)(({ theme }) => ({
  background: theme.palette.info.main,
  color: theme.palette.info.contrastText,
  borderRadius: theme.shape.borderRadius,
  height: 26,
}));

export const BooleanProperty = ({
  redacted,
  data,
  wrap,
  ...rest
}: BooleanPropertyProps) => {
  const chip = <StyledChip {...rest} />;

  const out = !data ? (
    <Skeleton>{chip}</Skeleton>
  ) : !data.canRead ? (
    <Redacted info={redacted}>{chip}</Redacted>
  ) : data.value ? (
    chip
  ) : null;
  if (!out) {
    return null;
  }
  return wrap ? wrap(out) : out;
};
