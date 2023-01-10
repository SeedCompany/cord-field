import { Theme, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Role } from '~/api/schema/schema.graphql';
import { VariantFragment as Variant } from '~/common/fragments';
import { RoleIcon } from '../../RoleIcon';

const transparentBgSx = {
  backgroundColor: 'transparent',
};

const iconSx = {
  height: 36,
  width: 36,
  mr: 0,
};

const ToggleButtonSx = (role: Role) => (theme: Theme) => ({
  p: 0.25,
  pr: 1,
  mr: 0,
  borderRadius: 0.6,
  '&.Mui-selected': {
    backgroundColor: theme.palette.roles[role]?.main,
  },
  '&.Mui-selected:hover': {
    backgroundColor: theme.palette.roles[role]?.main,
  },
});

export const VariantSelector = ({
  variants,
  value,
  onChange,
}: {
  variants: Variant[];
  value: Variant;
  onChange: (variant: Variant) => void;
}) => {
  const isSelected = (v: Variant) => v.key === value.key;

  if (variants.length < 2) {
    return null;
  }

  return (
    <ToggleButtonGroup
      value={value.key}
      exclusive
      onChange={(_e, value) => {
        if (value !== null) {
          onChange(variants.find((v) => v.key === value) ?? variants[0]!);
        }
      }}
      color="secondary"
      sx={{ mt: 1, ml: 1 }}
    >
      {variants.map((v) => (
        <ToggleButton
          key={v.key}
          value={v.key}
          sx={[
            ToggleButtonSx(v.responsibleRole!),
            isSelected(v) && transparentBgSx,
          ]}
        >
          <RoleIcon
            variantRole={v.responsibleRole}
            sx={[iconSx, !isSelected(v) && transparentBgSx]}
          />
          {v.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
