import { StoreObject } from '@apollo/client/utilities';
import {
  IdFragment,
  ProductProgress,
  StepProgress,
  Storable,
} from '../../../api';
import { modifyProgressRelatingToEngagement } from '../ProgressRefsRelatingToEngagement';
import { CreateDirectScriptureProductMutation as CreateProductMutation } from './CreateProduct.graphql';

/**
 * For all related ProgressReports (via Engagement),
 * add a connection to the new product (this the ProductProgress object).
 * For each step in the new product, add a StepProgress with a null completed value.
 */
export const addProductProgress = (engagement: IdFragment) =>
  modifyProgressRelatingToEngagement<CreateProductMutation>(
    engagement,
    (report, { createProduct: { product } }) =>
      (list, { toReference }) => {
        const newProductProgress: Storable<ProductProgress> = {
          __typename: 'ProductProgress',
          report: toReference(report)!,
          product: toReference(product)!,
          steps: product.steps.value.map(
            (step): Storable<StepProgress> => ({
              __typename: 'StepProgress',
              step,
              completed: {
                __typename: 'SecuredFloatNullable',
                value: null,
                // Assuming someone changing the product has permission
                // to edit progress as well.
                canRead: true,
                canEdit: true,
              },
              // @ts-expect-error deprecated and we don't use it. Can remove
              // this line when API removes it.
              percentDone: undefined,
            })
          ),
        };
        const newRef = toReference(newProductProgress as StoreObject, true)!;
        return [...list, newRef];
      }
  );
