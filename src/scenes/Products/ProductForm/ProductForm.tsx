import { makeStyles, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Form, FormProps } from 'react-final-form';
import { useNavigate } from 'react-router';
import { GQLOperations } from '../../../api';
import {
  FieldGroup,
  SubmitAction,
  SubmitButton,
  SubmitError,
} from '../../../components/form';
import { AccordionSection, ProductFormValues } from './AccordionSection';
import {
  ProductFormFragment,
  useDeleteProductMutation,
} from './ProductForm.generated';

const useStyles = makeStyles(({ spacing }) => ({
  submissionBlurb: {
    margin: spacing(4, 0),
    width: spacing(50),
    '& h4': {
      marginBottom: spacing(1),
    },
  },
  deleteButton: {
    marginLeft: spacing(1),
  },
}));

export const ProductForm = ({
  product,
  ...props
}: FormProps<ProductFormValues> & {
  product?: ProductFormFragment;
}) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [deleteProduct] = useDeleteProductMutation({
    awaitRefetchQueries: true,
    refetchQueries: [GQLOperations.Query.Engagement],
  });

  return (
    <Form<ProductFormValues>
      {...props}
      onSubmit={async (data, form) => {
        if ((data as SubmitAction).submitAction !== 'delete') {
          return await props.onSubmit(data, form);
        }
        if (!product) {
          return;
        }

        await deleteProduct({
          variables: {
            productId: product.id,
          },
        });
        enqueueSnackbar(`Product deleted`, {
          variant: 'success',
        });
        navigate('../../');
      }}
    >
      {({ handleSubmit, ...rest }) => (
        <form onSubmit={handleSubmit}>
          <SubmitError />
          <FieldGroup prefix="product">
            <AccordionSection product={product} {...rest} />
          </FieldGroup>
          <div className={classes.submissionBlurb}>
            <Typography variant="h4">Check Your Selections</Typography>
            <Typography>
              If the selections above look good to you, go ahead and save your
              Product. If you need to edit your choices, do that above.
            </Typography>
          </div>
          <SubmitButton fullWidth={false} color="primary" size="medium">
            Save Product
          </SubmitButton>
          {product && (
            <SubmitButton
              action="delete"
              fullWidth={false}
              size="medium"
              className={classes.deleteButton}
            >
              Delete Product
            </SubmitButton>
          )}
        </form>
      )}
    </Form>
  );
};
