import { Grading, Translate } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';
import { ComponentType } from 'react';
import { Except } from 'type-fest';
import { Role } from '~/api/schema.graphql';
import { extendSx } from '~/common';
import { PeopleJoinedIcon } from '~/components/Icons';
import { ProjectManagerIcon } from '~/components/Icons/ProjectManagerIcon';
import { colorPalette } from './colorPalette';

const variantToIconMapper: {
  [key in Role]?: ComponentType<SvgIconProps>;
} = {
  FieldPartner: PeopleJoinedIcon,
  Translator: Translate,
  ProjectManager: ProjectManagerIcon,
  Marketing: Grading,
};
interface RoleIconProps extends Except<SvgIconProps, 'role'> {
  role?: Role | null;
}

export const RoleIcon = ({ role, sx, ...rest }: RoleIconProps) => {
  if (!role) {
    return null;
  }

  const Icon = variantToIconMapper[role];

  return Icon ? (
    <Icon
      sx={[
        {
          backgroundColor: colorPalette.stepperCard.iconBackground[role],
          marginRight: 1,
          padding: 1,
          height: 48,
          width: 48,
        },
        ...extendSx(sx),
      ]}
      {...rest}
    />
  ) : null;
};
