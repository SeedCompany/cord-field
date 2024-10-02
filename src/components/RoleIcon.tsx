import { Grading, Translate } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';
import { ComponentType, forwardRef } from 'react';
import { Role } from '../api/schema.graphql';
import { extendSx } from '../common';
import { PeopleJoinedIcon } from './Icons';
import { ProjectManagerIcon } from './Icons/ProjectManagerIcon';

const variantToIconMapper: {
  [key in Role]?: ComponentType<SvgIconProps>;
} = {
  FieldPartner: PeopleJoinedIcon,
  Translator: Translate,
  ProjectManager: ProjectManagerIcon,
  Marketing: Grading,
};

interface RoleIconProps extends SvgIconProps {
  variantRole?: Role | null;
}

export const RoleIcon = forwardRef<SVGSVGElement, RoleIconProps>(
  function RoleIcon({ variantRole: role, sx, ...rest }, ref) {
    if (!role) {
      return null;
    }

    const Icon = variantToIconMapper[role];
    if (!Icon) {
      return null;
    }

    return (
      <Icon
        sx={[
          (theme) => {
            const color = theme.palette.roles[role]?.main;
            return {
              backgroundColor: color,
              color: color ? theme.palette.getContrastText(color) : undefined,
              marginRight: 1,
              padding: 1,
              fontSize: 48,
              borderRadius: 2,
            };
          },
          ...extendSx(sx),
        ]}
        {...rest}
        ref={ref}
      />
    );
  }
);
