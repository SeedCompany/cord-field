import { Grading, Translate } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Role } from '~/api/schema.graphql';
import { PeopleJoinedIcon } from '~/components/Icons';
import { ProjectManagerIcon } from '~/components/Icons/ProjectManagerIcon';
import { colorPalette } from './colorPalette';

interface StepIconProps {
  roleStep?: Role | null;
}

const variantToIconMapper: {
  [key in Role]: React.FC | null;
} = {
  FieldPartner: PeopleJoinedIcon,
  Translator: Translate,
  ProjectManager: ProjectManagerIcon,
  Marketing: Grading,
  Administrator: null,
  BetaTester: null,
  BibleTranslationLiaison: null,
  Consultant: null,
  ConsultantManager: null,
  Controller: null,
  ExperienceOperations: null,
  FieldOperationsDirector: null,
  FinancialAnalyst: null,
  Fundraising: null,
  Intern: null,
  LeadFinancialAnalyst: null,
  Leadership: null,
  Liaison: null,
  Mentor: null,
  RegionalCommunicationsCoordinator: null,
  RegionalDirector: null,
  StaffMember: null,
};

export const RoleIcon = ({ roleStep = 'FieldPartner' }: StepIconProps) => {
  if (!roleStep) {
    return null;
  }

  return (
    <Box
      component={variantToIconMapper[roleStep] ?? PeopleJoinedIcon}
      sx={{
        backgroundColor: colorPalette.stepperCard.iconBackground[roleStep],
        marginRight: 1,
        padding: 1,
        height: 48,
        width: 48,
      }}
    />
  );
};
