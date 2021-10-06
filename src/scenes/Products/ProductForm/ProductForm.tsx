import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Form, FormProps } from 'react-final-form';
import { Except, Merge } from 'type-fest';
import {
  CreateOtherProduct,
  CreateProduct,
  UpdateOtherProduct,
  UpdateProduct,
} from '../../../api';
import {
  SubmitAction,
  SubmitButton,
  SubmitError,
} from '../../../components/form';
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
      CreateProduct & UpdateProduct & CreateOtherProduct & UpdateOtherProduct,
      'id' | 'engagementId'
    >,
    ProductFormCustomValues
  >;
}

export type ProductFormProps = FormProps<ProductFormValues> & {
  product?: ProductFormFragment;
};

export const ProductForm = ({ product, ...props }: ProductFormProps) => {
  const classes = useStyles();

  return (
    <Form<ProductFormValues> {...props}>
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
