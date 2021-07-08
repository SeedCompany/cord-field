import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Form, FormProps } from 'react-final-form';
import {
  FieldGroup,
  SubmitButton,
  SubmitError,
} from '../../../components/form';
import { AccordionSection, ProductFormValues } from './AccordionSection';
import {
  AvailableMethodologyStepsFragment as AvailableMethodologySteps,
  ProductFormFragment,
  StepProgressFragment as StepProgress,
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

export type ProductFormProps = FormProps<ProductFormValues> & {
  product?: ProductFormFragment;
  methodologyAvailableSteps?: readonly AvailableMethodologySteps[];
  productSteps?: readonly StepProgress[];
};

export const ProductForm = ({
  product,
  methodologyAvailableSteps,
  productSteps,
  ...props
}: ProductFormProps) => {
  const classes = useStyles();

  return (
    <Form<ProductFormValues>
      {...props}
      mutators={{
        setValue: ([field, value], state, utils) => {
          utils.changeValue(state, field, () => value);
        },
      }}
    >
      {({ handleSubmit, ...rest }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item container xs={7} direction="column">
              <SubmitError />
              <FieldGroup prefix="product">
                <AccordionSection
                  product={product}
                  methodologyAvailableSteps={methodologyAvailableSteps}
                  {...rest}
                />
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
          </Grid>
        </form>
      )}
    </Form>
  );
};
