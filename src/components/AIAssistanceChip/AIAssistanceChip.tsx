import { Chip } from '@mui/material';
import { Except } from 'type-fest';
import { AiAssistedTranslation } from '~/api/schema.graphql';
import { SecuredProp } from '~/common';

export const AIAssistanceLabelMap: Record<AiAssistedTranslation, string> = {
  Unknown: 'Unknown',
  None: 'None',
  Draft: 'AI-Enabled Drafting',
  Check: 'AI-Enabled Checking',
  DraftAndCheck: 'AI-Enabled Drafting & Checking',
  Other: 'Other AI Assistance',
};
export interface AIAssistanceChipProps {
  aiAssistance: Except<SecuredProp<AiAssistedTranslation>, 'canEdit'>;
}

export const AIAssistanceChip = ({ aiAssistance }: AIAssistanceChipProps) => {
  const { value } = aiAssistance;
  if (
    !value ||
    value === 'Unknown' ||
    value === 'None' ||
    !aiAssistance.canRead
  ) {
    return null;
  }

  return (
    <Chip
      sx={{
        bgcolor: 'warning.main',
        color: 'info.contrastText',
        borderRadius: 1,
        height: 26,
      }}
      label={AIAssistanceLabelMap[value]}
    />
  );
};
