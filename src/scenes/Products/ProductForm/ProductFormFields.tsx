import React, { ComponentType, useState } from 'react';
import { FormRenderProps, RenderableProps } from 'react-final-form';
import { Except, Merge, UnionToIntersection } from 'type-fest';
import { FieldGroup, SecuredEditableKeys } from '../../../components/form';
import { CompletionSection } from './CompletionSection';
import { MediumsSection } from './MediumsSection';
import { MethodologySection } from './MethodologySection';
import { ProducesSection } from './ProducesSection';
import { ProductFormValues } from './ProductForm';
import {
  ProductForm_DerivativeScriptureProduct_Fragment as DerivativeScriptureProduct,
  ProductForm_DirectScriptureProduct_Fragment as DirectScriptureProduct,
  ProductFormFragment,
} from './ProductForm.generated';
import { PurposesSection } from './PurposesSection';
import { ScriptureReferencesSection } from './ScriptureReferencesSection';
import { StepsSection } from './StepsSection';

export type Product = UnionToIntersection<ProductFormFragment>;

export type ProductKey = string &
  (
    | SecuredEditableKeys<DirectScriptureProduct>
    | Omit<SecuredEditableKeys<DerivativeScriptureProduct>, 'producesId'>
    | 'produces'
  );

export type SectionProps = Except<
  FormRenderProps<ProductFormValues>,
  'handleSubmit' | keyof RenderableProps<any>
> & {
  product?: Product;
  accordionState: {
    product?: Product;
    openedSection: ProductKey | undefined;
    onOpen: (name: ProductKey | undefined) => void;
  };
};

const sections: ReadonlyArray<ComponentType<SectionProps>> = [
  ProducesSection,
  ScriptureReferencesSection,
  MediumsSection,
  PurposesSection,
  MethodologySection,
  StepsSection,
  CompletionSection,
];

export const ProductFormFields = ({
  product: productProp,
  ...props
}: Merge<
  Except<SectionProps, 'accordionState'>,
  { product?: ProductFormFragment }
>) => {
  const product = productProp as Product | undefined;

  const [openedSection, onOpen] = useState<ProductKey | undefined>(
    product ? undefined : 'produces'
  );

  return (
    <FieldGroup prefix="product">
      {sections.map((Section) => (
        <Section
          key={Section.name}
          {...props}
          product={product}
          accordionState={{ product, openedSection, onOpen }}
        />
      ))}
    </FieldGroup>
  );
};
