import { Chip } from '@mui/material';
import { VariantFragment } from '../common/fragments';
import { RoleIcon } from './RoleIcon';

export const VariantChip = ({ variant }: { variant: VariantFragment }) => (
  <Chip
    label={variant.label}
    icon={
      <RoleIcon
        variantRole={variant.responsibleRole}
        sx={{ fontSize: 38, bgcolor: 'transparent' }}
      />
    }
    sx={{ bgcolor: `roles.${variant.responsibleRole}.main` }}
  />
);
