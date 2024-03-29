import { CardActionArea, CardActionAreaProps } from '@mui/material';
import { forwardRef } from 'react';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { Link, LinkProps } from 'react-router-dom';
import { Merge } from 'type-fest';

export type CardActionAreaLinkProps = InternalProps | ExternalProps;

type BaseProps = Omit<CardActionAreaProps<'a'>, 'component' | 'href'>;

interface InternalProps extends Merge<BaseProps, LinkProps> {
  external?: false;
}

interface ExternalProps extends BaseProps {
  external: true;
  to: string;
}

export const CardActionAreaLink = forwardRef<
  HTMLAnchorElement,
  CardActionAreaLinkProps
>(function CardActionAreaLink({ external, to, children, ...props }, ref) {
  const other: any = {
    ref,
    component: external ? 'a' : Link,
    ...(external ? { href: to } : { to }),
  };
  return (
    <CardActionArea {...props} {...other}>
      {children}
    </CardActionArea>
  );
});
