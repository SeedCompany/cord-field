import { Grading, Translate } from '@mui/icons-material';
import { Box } from '@mui/material';
import { PeopleJoinedIcon } from '~/components/Icons';
import { ProjectManagerIcon } from '~/components/Icons/ProjectManagerIcon';
import { PromptVariant } from '../../ProgressReportContext';
import { colorPalette } from './colorPalette';

interface StepIconProps {
  promptVariant: PromptVariant;
}

const variantToIconMapper: {
  [key in PromptVariant]: React.FC;
} = {
  Partner: PeopleJoinedIcon,
  Translation: Translate,
  'FPM Notes': ProjectManagerIcon,
  'Communications Edit': Grading,
};

export const PromptVariantIcon = ({ promptVariant }: StepIconProps) => {
  return (
    <Box
      component={variantToIconMapper[promptVariant]}
      sx={{
        backgroundColor: colorPalette.stepperCard.iconBackground[promptVariant],
        marginRight: 1,
        padding: 1,
        height: 48,
        width: 48,
      }}
    />
  );
};
