import React, { cloneElement, FC, ReactElement } from 'react';

export const Nest: FC<{ elements: ReactElement[] }> = ({
  elements,
  children,
}) =>
  elements.reduceRight(
    (out, element) => cloneElement(element, {}, out),
    <>{children}</>
  );
