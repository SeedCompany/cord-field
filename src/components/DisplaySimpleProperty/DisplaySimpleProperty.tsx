import { Skeleton, Typography, TypographyProps } from '@mui/material';
import { ReactElement, ReactNode } from 'react';

export type DisplaySimplePropertyProps = TypographyProps & {
  label?: string;
  LabelProps?: TypographyProps;
  value?: ReactNode;
  ValueProps?: TypographyProps;
  loading?: boolean | ReactNode;
  loadingWidth?: number | string;
  wrap?: (node: ReactElement) => ReactElement;
};

export const DisplaySimpleProperty = ({
  label,
  LabelProps,
  value,
  ValueProps,
  loading,
  loadingWidth,
  wrap,
  ...props
}: DisplaySimplePropertyProps) => {
  const shouldDisplay = loading || (label && value);
  if (!shouldDisplay) return null;
  if (loading === true && !loadingWidth) {
    return (
      <div>
        <Typography variant="body2">
          <Skeleton width="10%" />
        </Typography>
        <Typography variant="body2">
          <Skeleton width="40%" />
        </Typography>
      </div>
    );
  }
  const property = (
    <Typography variant="body1" {...props}>
      {loading ? (
        loading
      ) : label && value ? (
        <>
          <Typography
            component="span"
            variant={LabelProps?.variant || 'body2'}
            color={LabelProps?.color || 'textSecondary'}
            {...LabelProps}
          >
            {label}:&nbsp;
          </Typography>
          <Typography
            component="span"
            variant={ValueProps?.variant || 'inherit'}
            color={ValueProps?.color || 'textPrimary'}
            {...ValueProps}
          >
            {value}
          </Typography>
        </>
      ) : null}
    </Typography>
  );
  return wrap ? wrap(property) : property;
};
