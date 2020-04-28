import { CardActionArea, CardActionAreaProps } from '@material-ui/core';
import * as React from 'react';
import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { Merge } from 'type-fest';

export type CardActionAreaLinkProps = InternalProps | ExternalProps;

type BaseProps = Omit<CardActionAreaProps<'a'>, 'component' | 'href'>;

interface InternalProps
  extends Merge<BaseProps, Omit<LinkProps, 'as' | 'href'>> {
  external?: false;
}

interface ExternalProps extends BaseProps {
  external: true;
  to: string;
}

export const CardActionAreaLink = forwardRef<
  HTMLAnchorElement,
  CardActionAreaLinkProps
>(({ external, to, children, ...props }, ref) => {
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
