import {
  Add as AddIcon,
  ChangeHistory as ChangeIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';
import { simpleSwitch } from '@seedcompany/common';
import { DiffMode } from './ChangesetDiffContext';

export interface ChangesetIconProps extends SvgIconProps {
  mode: DiffMode;
}

export const ChangesetIcon = ({ mode, ...props }: ChangesetIconProps) => {
  const Icon = simpleSwitch(mode, {
    added: AddIcon,
    changed: ChangeIcon,
    removed: RemoveIcon,
  })!;
  return <Icon {...props} />;
};
