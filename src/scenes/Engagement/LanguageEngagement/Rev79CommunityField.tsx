import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useRev79Communities } from '~/api/seed/useRev79Communities';
import { useField } from '../../../components/form/useField';
import { getHelperText, showError } from '../../../components/form/util';
import { LanguageEngagementHeaderFragment } from './Header/LanguageEngagementHeader.graphql';

interface Rev79CommunityFieldProps {
  name: string;
  parent: LanguageEngagementHeaderFragment['parent'];
  label?: string;
  disabled?: boolean;
}

export const Rev79CommunityField = ({
  parent,
  label,
  ...fieldProps
}: Rev79CommunityFieldProps) => {
  const rev79ProjectId =
    parent.__typename === 'MomentumTranslationProject'
      ? parent.rev79ProjectId.value
      : null;

  const { communities, loading } = useRev79Communities(rev79ProjectId);

  const { input, meta } = useField<string, false>({
    ...fieldProps,
    allowNull: true,
  });

  return (
    <FormControl
      fullWidth
      disabled={meta.disabled}
      focused={meta.focused}
      error={showError(meta)}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        {...input}
        value={input.value ?? ''}
        label={label}
        onChange={(e) => input.onChange(e.target.value || null)}
        endAdornment={
          loading && (
            <InputAdornment position="end" sx={{ mr: 2 }}>
              <CircularProgress size={16} />
            </InputAdornment>
          )
        }
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {communities.map((community) => (
          <MenuItem key={community.id} value={community.id}>
            {community.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{getHelperText(meta, undefined)}</FormHelperText>
    </FormControl>
  );
};
