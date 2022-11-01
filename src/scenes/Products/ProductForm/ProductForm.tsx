import { Box } from '@mui/material';
import { Decorator } from 'final-form';
import onFieldChange from 'final-form-calculate';
import { Form, FormProps } from 'react-final-form';
import { Except, Merge } from 'type-fest';
import {
  CreateDerivativeScriptureProduct,
  CreateDirectScriptureProduct,
  CreateOtherProduct,
  ProgressMeasurement,
  UpdateDerivativeScriptureProduct,
  UpdateDirectScriptureProduct,
  UpdateOtherProduct,
} from '~/api/schema.graphql';
import {
  SubmitAction,
  SubmitButton,
  SubmitError,
} from '../../../components/form';
import { ProductTypes } from './constants';
import { EditPartnershipsProducingMediumsInfoFragment } from './PartnershipsProducingMediums.graphql';
import { ProductFormFragment } from './ProductForm.graphql';
import { ProductFormFields } from './ProductFormFields';

// eslint-disable-next-line @typescript-eslint/no-empty-interface -- Declaration merging is used to define fields in each section
export interface ProductFormCustomValues {}

export interface ProductFormValues extends SubmitAction<'delete'> {
  product?: Merge<
    Except<
      CreateDirectScriptureProduct &
        UpdateDirectScriptureProduct &
        CreateDerivativeScriptureProduct &
        UpdateDerivativeScriptureProduct &
        CreateOtherProduct &
        UpdateOtherProduct,
      'id' | 'engagementId'
    >,
    ProductFormCustomValues
  >;
}

export type ProductFormProps = FormProps<ProductFormValues> & {
  product?: ProductFormFragment;
  engagement: EditPartnershipsProducingMediumsInfoFragment;
};

const decorators: Array<Decorator<ProductFormValues>> = [
  onFieldChange({
    field: 'product.productType',
    updates: {
      'product.progressStepMeasurement': (
        productType: ProductTypes,
        { product }
      ): ProgressMeasurement | undefined => {
        if (productType === 'Other') {
          return product?.progressStepMeasurement ?? undefined;
        }
        if (productType === 'EthnoArt') {
          return 'Number';
        }
        return 'Percent';
      },
    },
  }),
  onFieldChange({
    field: 'product.book',
    updates: (book, field, allValues, prevValues) =>
      // Clear scripture if book is cleared or a different book is selected
      !(book && !prevValues?.product?.book)
        ? {
            'product.bookSelection': 'full',
            'product.scriptureReferences': null,
            'product.unspecifiedScripture': null,
          }
        : {},
  }),
  onFieldChange({
    field: 'product.bookSelection',
    updates: (selection) => ({
      ...(selection !== 'partialKnown'
        ? { 'product.scriptureReferences': null }
        : {}),
      ...(selection !== 'partialUnknown'
        ? { 'product.unspecifiedScripture': null }
        : {}),
    }),
  }),
];

export const ProductForm = ({
  product,
  engagement,
  ...props
}: ProductFormProps) => {
  return (
    <Form<ProductFormValues> decorators={decorators} {...props}>
      {({ handleSubmit, ...rest }) => (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 'md' }}>
          <SubmitError />
          {/* Need to give accordions their own container for styling */}
          <div>
            <ProductFormFields
              product={product}
              engagement={engagement}
              {...rest}
            />
          </div>

          <Box sx={{ mt: 2 }}>
            <SubmitButton fullWidth={false} color="primary" size="medium">
              Save Goal
            </SubmitButton>
            {product && (
              <SubmitButton
                action="delete"
                fullWidth={false}
                size="medium"
                sx={{ ml: 1 }}
              >
                Delete Goal
              </SubmitButton>
            )}
          </Box>
        </Box>
      )}
    </Form>
  );
};
