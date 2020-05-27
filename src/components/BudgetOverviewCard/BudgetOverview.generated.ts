/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type BudgetOverviewFragment = { __typename?: 'Budget' } & Pick<
  Types.Budget,
  'id' | 'createdAt' | 'total'
>;

export const BudgetOverviewFragmentDoc = gql`
  fragment BudgetOverview on Budget {
    id
    createdAt
    total
  }
`;
