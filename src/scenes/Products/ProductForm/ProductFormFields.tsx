import { FormApi, FormState } from 'final-form';
import React, { ComponentType, useState } from 'react';
import { Except, Merge, UnionToIntersection } from 'type-fest';
import { FieldGroup, SecuredEditableKeys } from '../../../components/form';
import { CompletionSection } from './CompletionSection';
import { GoalsSection } from './GoalsSection';
import { MediumsSection } from './MediumsSection';
import { MethodologySection } from './MethodologySection';
import { OtherProductSection } from './OtherProductSection';
import { PartnershipProducingMediumsSection } from './PartnershipProducingMediumsSection';
import { EditPartnershipsProducingMediumsInfoFragment } from './PartnershipsProducingMediums.graphql';
import { ProductFormValues } from './ProductForm';
import {
  ProductForm_DerivativeScriptureProduct_Fragment as DerivativeScriptureProduct,
  ProductForm_DirectScriptureProduct_Fragment as DirectScriptureProduct,
  ProductFormFragment,
} from './ProductForm.graphql';
import { ProductSection } from './ProductSection';
import { ProgressMeasurementSection } from './ProgressMeasurementSection';
import { ProgressTargetSection } from './ProgressTargetSection';
import { ScriptureReferencesSection } from './ScriptureReferencesSection';
import { StepsSection } from './StepsSection';

export type Product = UnionToIntersection<ProductFormFragment>;

export type ProductKey = string &
  (
    | SecuredEditableKeys<DirectScriptureProduct>
    | Omit<SecuredEditableKeys<DerivativeScriptureProduct>, 'producesId'>
    | 'produces'
    | 'otherProduct'
  );

type FormProps<T> = FormState<T> & { form: FormApi<T> };

export type SectionProps = FormProps<ProductFormValues> & {
  product?: Product;
  engagement: EditPartnershipsProducingMediumsInfoFragment;
  accordionState: FormProps<ProductFormValues> & {
    product?: Product;
    openedSection: ProductKey | undefined;
    onOpen: (name: ProductKey | undefined) => void;
  };
};

const sections: ReadonlyArray<ComponentType<SectionProps>> = [
  GoalsSection,
  ProductSection,
  OtherProductSection,
  ScriptureReferencesSection,
  MediumsSection,
  PartnershipProducingMediumsSection,
  MethodologySection,
  ProgressMeasurementSection,
  ProgressTargetSection,
  StepsSection,
  CompletionSection,
];

export const ProductFormFields = ({
  product: productProp,
  engagement,
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
          engagement={engagement}
          accordionState={{
            product,
            openedSection,
            onOpen,
            ...props,
          }}
        />
      ))}
    </FieldGroup>
  );
};
