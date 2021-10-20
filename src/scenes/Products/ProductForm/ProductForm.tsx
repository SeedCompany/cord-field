import { makeStyles, Typography } from '@material-ui/core';
import { Decorator } from 'final-form';
import onFieldChange from 'final-form-calculate';
import React from 'react';
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
} from '../../../api';
import {
  SubmitAction,
  SubmitButton,
  SubmitError,
} from '../../../components/form';
import { ProductTypes } from './constants';
import { ProductFormFragment } from './ProductForm.generated';
import { ProductFormFields } from './ProductFormFields';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  form: {
    maxWidth: breakpoints.values.md,
  },
  submissionBlurb: {
    margin: spacing(4, 0),
    maxWidth: 400,
    '& h4': {
      marginBottom: spacing(1),
    },
  },
  deleteButton: {
    marginLeft: spacing(1),
  },
}));

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
        if (productType === 'Song') {
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
          }
        : {},
  }),
  onFieldChange({
    field: 'product.bookSelection',
    updates: (selection) =>
      selection !== 'partialKnown'
        ? { 'product.scriptureReferences': null }
        : {},
  }),
];

export const ProductForm = ({ product, ...props }: ProductFormProps) => {
  const classes = useStyles();

  return (
    <Form<ProductFormValues> decorators={decorators} {...props}>
      {({ handleSubmit, ...rest }) => (
        <form onSubmit={handleSubmit} className={classes.form}>
          <SubmitError />
          {/* Need to give accordions their own container for styling */}
          <div>
            <ProductFormFields product={product} {...rest} />
          </div>
          <div className={classes.submissionBlurb}>
            <Typography variant="h4">Check Your Selections</Typography>
            <Typography>
              If the selections above look good to you, go ahead and save your
              Goal. If you need to edit your choices, do that above.
            </Typography>
          </div>

          <div>
            <SubmitButton fullWidth={false} color="primary" size="medium">
              Save Goal
            </SubmitButton>
            {product && (
              <SubmitButton
                action="delete"
                fullWidth={false}
                size="medium"
                className={classes.deleteButton}
              >
                Delete Goal
              </SubmitButton>
            )}
          </div>
        </form>
      )}
    </Form>
  );
};
