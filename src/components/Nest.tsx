import React, { cloneElement, ReactElement } from 'react';
import { ChildrenProp } from '~/common';

export const Nest = ({
  elements,
  children,
}: { elements: ReactElement[] } & ChildrenProp) =>
  elements.reduceRight(
    (out, element) => cloneElement(element, {}, out),
    <>{children}</>
  );
