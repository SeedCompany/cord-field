import { Grid, makeStyles, Typography } from '@material-ui/core';
import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Form, FormProps, FormSpy } from 'react-final-form';
import {
  FieldGroup,
  SubmitButton,
  SubmitError,
} from '../../../components/form';
import { AccordionSection, ProductFormValues } from './AccordionSection';
import { scriptureSteps } from './constants';
import { ProductFormFragment } from './ProductForm.generated';
import { StepFormState } from './StepEditDialog';
import { StepsList } from './StepsList';

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

export type ProductFormProps = FormProps<ProductFormValues> & {
  product?: ProductFormFragment;
};

export const ProductForm = ({ product, ...props }: ProductFormProps) => {
  const classes = useStyles();

  const [steps, setSteps] = useState<StepFormState[]>();

  const getProductStepsList = (productType: string) =>
    scriptureSteps[productType]?.map<StepFormState>((step) => ({
      name: step,
    }));

  useEffect(() => {
    if (!product) {
      setSteps(getProductStepsList('DirectScriptureProduct'));
    }
    if (product?.productSteps) {
      setSteps(
        product.productSteps.items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          progress: item.progress,
        }))
      );
    }
  }, [product]);

  return (
    <Form<ProductFormValues>
      {...props}
      mutators={{
        setValue: ([field, value], state, utils) => {
          utils.changeValue(state, field, () => value);
        },
      }}
      onSubmit={(values, form) => {
        void props.onSubmit(
          {
            product: {
              ...values.product,
              productSteps: steps,
            },
          },
          form
        );
      }}
    >
      {({ handleSubmit, ...rest }) => (
        <form onSubmit={handleSubmit}>
          <FormSpy<ProductFormValues>
            subscription={{ values: true }}
            onChange={async ({ values }) => {
              if (
                !isEqual(values, props.initialValues) &&
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                values.product?.productType
              ) {
                setSteps(getProductStepsList(values.product.productType));
              }
            }}
          />

          <Grid container spacing={3}>
            <Grid item container xs={7} direction="column">
              <SubmitError />
              <FieldGroup prefix="product">
                <AccordionSection product={product} {...rest} />
              </FieldGroup>
              <div className={classes.submissionBlurb}>
                <Typography variant="h4">Check Your Selections</Typography>
                <Typography>
                  If the selections above look good to you, go ahead and save
                  your Product. If you need to edit your choices, do that above.
                </Typography>
              </div>
              <div>
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
              </div>
            </Grid>

            {steps && (
              <Grid item container xs={5}>
                <StepsList steps={steps} onSubmit={setSteps} />
              </Grid>
            )}
          </Grid>
        </form>
      )}
    </Form>
  );
};
