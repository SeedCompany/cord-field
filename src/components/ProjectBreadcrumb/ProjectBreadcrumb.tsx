import { Skeleton } from '@mui/material';
import { Nullable } from '~/common';
import { getProjectUrl } from '../../scenes/Projects/useProjectId';
import { Breadcrumb, BreadcrumbProps } from '../Breadcrumb';
import { Redacted } from '../Redacted';
import { SensitivityIcon } from '../Sensitivity';
import { ProjectBreadcrumbFragment } from './ProjectBreadcrumb.graphql';

export interface ProjectBreadcrumbProps extends Partial<BreadcrumbProps> {
  data?: Nullable<ProjectBreadcrumbFragment>;
}

export const ProjectBreadcrumb = ({
  data,
  ...rest
}: ProjectBreadcrumbProps) => {
  return (
    <Breadcrumb
      to={data ? getProjectUrl(data) : undefined}
      LinkProps={{
        underline: data?.name.canRead ? undefined : 'none',
      }}
      {...rest}
      className={rest.className}
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {data ? (
        <>
          {!data.name.canRead ? (
            <Redacted
              info="You don't have permission to view this project's name"
              width={200}
            />
          ) : (
            data.name.value
          )}
          <SensitivityIcon value={data.sensitivity} sx={{ marginLeft: 1 }} />
        </>
      ) : (
        <Skeleton width={200} />
      )}
    </Breadcrumb>
  );
};
