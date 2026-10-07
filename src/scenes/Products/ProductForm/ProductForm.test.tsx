import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getFullBookRange } from '~/common';
import { ThemeProvider } from '~/theme/ThemeProvider';
import { EditPartnershipsProducingMediumsInfoFragment } from './PartnershipsProducingMediums.graphql';
import { ProductForm, ProductFormValues } from './ProductForm';
import { AvailableProductStepsDocument } from './ProductForm.graphql';

// Minimum engagement that hides the partnerships producing mediums section.
const hiddenPpmEngagement = {
  __typename: 'LanguageEngagement',
  id: 'engagement-1',
  partnershipsProducingMediums: { canRead: false, canEdit: false, items: [] },
  project: {
    __typename: 'MomentumTranslationProject',
    id: 'project-1',
    partnerships: { items: [] },
  },
} as unknown as EditPartnershipsProducingMediumsInfoFragment;

const noStepsMock: MockedResponse = {
  request: { query: AvailableProductStepsDocument },
  variableMatcher: () => true,
  maxUsageCount: Number.POSITIVE_INFINITY,
  result: { data: { availableProductSteps: [] } },
};

const noop = () => {
  // noop
};

function renderForm(initialValues: ProductFormValues) {
  render(
    <ThemeProvider>
      <MockedProvider mocks={[noStepsMock]}>
        <MemoryRouter>
          <ProductForm
            engagement={hiddenPpmEngagement}
            initialValues={initialValues}
            onSubmit={noop}
          />
        </MemoryRouter>
      </MockedProvider>
    </ThemeProvider>
  );
}

describe('ProductForm — Other goal scripture references', () => {
  it('shows the Scripture Reference section for Other goals', async () => {
    renderForm({ productType: 'Other', bookSelection: 'full', title: '' });

    await waitFor(() => {
      expect(screen.getByText('Scripture Reference')).toBeInTheDocument();
    });
  });

  it('shows the existing book for an Other goal', async () => {
    renderForm({
      productType: 'Other',
      title: 'Other goal',
      book: 'Matthew',
      bookSelection: 'full',
      scriptureReferences: [getFullBookRange('Matthew')],
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Matthew' })).toBeVisible();
    });
  });
});
