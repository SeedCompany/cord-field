import {
  Add as AddIcon,
  ChangeHistory as ChangeIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';
import { simpleSwitch, StyleProps } from '~/common';
import { DiffMode } from './ChangesetDiffContext';

export interface ChangesetIconProps extends SvgIconProps, StyleProps {
  mode: DiffMode;
}

export const ChangesetIcon = ({ mode, sx, ...props }: ChangesetIconProps) => {
  const Icon = simpleSwitch(mode, {
    added: AddIcon,
    changed: ChangeIcon,
    removed: RemoveIcon,
  })!;
  return <Icon {...props} sx={sx} />;
};
