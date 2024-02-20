import { ReactNode } from 'react';
import { Merge } from 'type-fest';
import {
  SecuredField,
  SecuredFieldRenderProps,
} from '../../../components/form';
import { DefaultAccordion, DefaultAccordionProps } from './DefaultAccordion';
import { Product, ProductKey } from './ProductFormFields';

export const SecuredAccordion = <K extends ProductKey>({
  product,
  children,
  ...props
}: Merge<
  DefaultAccordionProps<K>,
  {
    product?: Product;
    children: (props: SecuredFieldRenderProps<K>) => ReactNode;
  }
>) => (
  <SecuredField obj={product} name={props.name}>
    {(fieldProps) => (
      <DefaultAccordion
        {...props}
        AccordionProps={{
          ...props.AccordionProps,
          disabled: props.AccordionProps?.disabled || fieldProps.disabled,
        }}
      >
        {children(fieldProps)}
      </DefaultAccordion>
    )}
  </SecuredField>
);
