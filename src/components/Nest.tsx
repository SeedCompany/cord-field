import React, { cloneElement, ReactElement } from 'react';
import { ChildrenProp } from '~/util';

export const Nest = ({
  elements,
  children,
}: { elements: ReactElement[] } & ChildrenProp) =>
  elements.reduceRight(
    (out, element) => cloneElement(element, {}, out),
    <>{children}</>
  );
