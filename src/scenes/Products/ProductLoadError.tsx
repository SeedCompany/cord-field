import React from 'react';
import { Except } from 'type-fest';
import { Error, ErrorProps } from '../../components/Error';

export const ProductLoadError = (props: Except<ErrorProps, 'children'>) => (
  <Error page component="main" {...props}>
    {{
      NotFound: 'Could not find goal',
      Default: 'Error loading goal',
    }}
  </Error>
);
