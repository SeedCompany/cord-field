import { Decorator } from 'final-form';
import onFieldChange from 'final-form-calculate';
import { Form, FormProps } from 'react-final-form';
import { makeStyles } from 'tss-react/mui';
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

const useStyles = makeStyles()(({ spacing, breakpoints }) => ({
  form: {
    maxWidth: breakpoints.values.md,
  },
  buttons: {
    marginTop: spacing(2),
  },
  deleteButton: {
    marginLeft: spacing(1),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-empty-interface -- Declaration merging is used to define fields in each section
export interface ProductFormCustomValues {}

export type ProductFormValues = SubmitAction<'delete'> &
  Merge<
    Except<
      CreateDirectScriptureProduct &
        UpdateDirectScriptureProduct &
        CreateDerivativeScriptureProduct &
        UpdateDerivativeScriptureProduct &
        CreateOtherProduct &
        UpdateOtherProduct,
      'id' | 'engagement' | 'produces'
    >,
    ProductFormCustomValues
  >;

export type ProductFormProps = FormProps<ProductFormValues> & {
  product?: ProductFormFragment;
  engagement: EditPartnershipsProducingMediumsInfoFragment;
};

const decorators: Array<Decorator<ProductFormValues>> = [
  onFieldChange({
    field: 'productType',
    updates: {
      progressStepMeasurement: (
        productType: ProductTypes,
        product
      ): ProgressMeasurement | undefined => {
        if (productType === 'Other') {
          return product.progressStepMeasurement ?? undefined;
        }
        if (productType === 'EthnoArt') {
          return 'Number';
        }
        return 'Percent';
      },
    },
  }),
  onFieldChange({
    field: 'book',
    updates: (book, field, allValues, prevValues) =>
      // Clear scripture if book is cleared or a different book is selected
      !(book && !prevValues?.book)
        ? {
            bookSelection: 'full',
            scriptureReferences: null,
            unspecifiedScripture: null,
          }
        : {},
  }),
  onFieldChange({
    field: 'bookSelection',
    updates: (selection) => ({
      ...(selection !== 'partialKnown' ? { scriptureReferences: null } : {}),
      ...(selection !== 'partialUnknown' ? { unspecifiedScripture: null } : {}),
    }),
  }),
];

export const ProductForm = ({
  product,
  engagement,
  ...props
}: ProductFormProps) => {
  const { classes } = useStyles();

  return (
    <Form<ProductFormValues> decorators={decorators} {...props}>
      {({ handleSubmit, ...rest }) => (
        <form onSubmit={handleSubmit} className={classes.form}>
          <SubmitError />
          {/* Need to give accordions their own container for styling */}
          <div>
            <ProductFormFields
              product={product}
              engagement={engagement}
              {...rest}
            />
          </div>

          <div className={classes.buttons}>
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
