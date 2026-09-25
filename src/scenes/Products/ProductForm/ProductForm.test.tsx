import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getFullBookRange } from '~/common';
import { ThemeProvider } from '~/theme/ThemeProvider';
import { SessionProvider } from '../../../components/Session';
import { EditPartnershipsProducingMediumsInfoFragment } from './PartnershipsProducingMediums.graphql';
import { ProductForm, ProductFormValues } from './ProductForm';
import { AvailableProductStepsDocument } from './ProductForm.graphql';
import { emptyScriptureBooks, toScriptureBooks } from './scriptureBooks';

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

function renderForm(
  initialValues: ProductFormValues,
  onSubmit: (values: ProductFormValues) => void = noop
) {
  render(
    <ThemeProvider>
      <MockedProvider mocks={[noStepsMock]}>
        <SessionProvider>
          <MemoryRouter>
            <ProductForm
              engagement={hiddenPpmEngagement}
              initialValues={initialValues}
              onSubmit={onSubmit}
            />
          </MemoryRouter>
        </SessionProvider>
      </MockedProvider>
    </ThemeProvider>
  );
}

describe('ProductForm — Other goal scripture references', () => {
  it('shows the Scripture Reference section for Other goals', async () => {
    renderForm({
      productType: 'Other',
      title: '',
      scriptureBooks: emptyScriptureBooks(),
    });

    await waitFor(() => {
      expect(screen.getByText('Scripture Reference')).toBeInTheDocument();
    });
  });

  it('shows the existing book for an Other goal', async () => {
    renderForm({
      productType: 'Other',
      title: 'Other goal',
      scriptureBooks: toScriptureBooks([getFullBookRange('Matthew')]),
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Matthew' })).toBeVisible();
    });
  });
});

describe('ProductForm — multiple scripture references', () => {
  const markRange = {
    start: { book: 'Mark', chapter: 1, verse: 1 },
    end: { book: 'Mark', chapter: 2, verse: 5 },
  };
  const twoBooks = () =>
    toScriptureBooks([getFullBookRange('Matthew'), markRange]);

  async function openScriptureSection() {
    fireEvent.click(await screen.findByText('Scripture Reference'));
  }

  function bookSummary(bookLabel: string) {
    return screen
      .getByText(bookLabel, { selector: 'p' })
      .closest<HTMLElement>('[aria-expanded]')!;
  }

  function bookPanel(bookLabel: string) {
    return bookSummary(bookLabel).closest<HTMLElement>('.MuiAccordion-root')!;
  }

  it.each(['EthnoArt', 'Story', 'Film', 'Other'] as const)(
    'shows a chip for each book of a %s goal',
    async (productType) => {
      renderForm({ productType, title: '', scriptureBooks: twoBooks() });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Matthew' })).toBeVisible();
      });
      expect(
        screen.getByRole('button', { name: 'Mark 1:1-2:5' })
      ).toBeVisible();
    }
  );

  it('opens the first book and collapses the others', async () => {
    renderForm({ productType: 'Film', title: '', scriptureBooks: twoBooks() });
    await openScriptureSection();

    expect(bookSummary('Matthew')).toHaveAttribute('aria-expanded', 'true');
    expect(bookSummary('Mark 1:1-2:5')).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(within(bookPanel('Matthew')).getByLabelText('Book')).toHaveValue(
      'Matthew'
    );
  });

  it('opens a book when its accordion is clicked', async () => {
    renderForm({ productType: 'Film', title: '', scriptureBooks: twoBooks() });
    await openScriptureSection();

    fireEvent.click(bookSummary('Mark 1:1-2:5'));

    expect(bookSummary('Mark 1:1-2:5')).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(bookSummary('Matthew')).toHaveAttribute('aria-expanded', 'false');
    expect(
      within(bookPanel('Mark 1:1-2:5')).getByLabelText('Book')
    ).toHaveValue('Mark');
  });

  it('collapses the open book when its accordion is clicked', async () => {
    renderForm({ productType: 'Film', title: '', scriptureBooks: twoBooks() });
    await openScriptureSection();

    fireEvent.click(bookSummary('Matthew'));

    expect(bookSummary('Matthew')).toHaveAttribute('aria-expanded', 'false');
  });

  it('adds an empty book with the plus button', async () => {
    renderForm({ productType: 'Other', title: '', scriptureBooks: twoBooks() });
    await openScriptureSection();

    fireEvent.click(
      screen.getByRole('button', { name: 'Add scripture reference' })
    );

    expect(bookSummary('New scripture reference')).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(
      within(bookPanel('New scripture reference')).getByLabelText('Book')
    ).toHaveValue('');
    // An empty book must be filled before another is added
    expect(
      screen.getByRole('button', { name: 'Add scripture reference' })
    ).toBeDisabled();
  });

  it('drops an empty book when another book is opened', async () => {
    renderForm({ productType: 'Other', title: '', scriptureBooks: twoBooks() });
    await openScriptureSection();

    fireEvent.click(
      screen.getByRole('button', { name: 'Add scripture reference' })
    );
    fireEvent.click(bookSummary('Matthew'));

    await waitFor(() => {
      expect(
        screen.queryByText('New scripture reference')
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole('button', { name: 'Add scripture reference' })
    ).toBeEnabled();
  });

  it('removes a book with its delete icon', async () => {
    renderForm({ productType: 'Other', title: '', scriptureBooks: twoBooks() });
    await openScriptureSection();

    fireEvent.click(
      screen.getByRole('button', { name: 'Remove Mark 1:1-2:5' })
    );

    await waitFor(() => {
      expect(screen.queryByText('Mark 1:1-2:5')).not.toBeInTheDocument();
    });
    expect(bookSummary('Matthew')).toBeInTheDocument();
  });

  it('opens a collapsed book with an error when the save fails', async () => {
    const onSubmit = jest.fn();
    renderForm(
      {
        productType: 'Other',
        title: 'Other goal',
        progressStepMeasurement: 'Percent',
        scriptureBooks: {
          book1: { book: 'Matthew', bookSelection: 'full' },
          book2: {
            book: 'Mark',
            bookSelection: 'partialKnown',
            scriptureReferences: [],
          },
        },
      },
      onSubmit
    );
    // The section opens by itself because it has an error
    await screen.findByText('Choose Scripture Reference');
    expect(bookSummary('Mark')).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Save Goal' }));

    await waitFor(() => {
      expect(bookSummary('Mark')).toHaveAttribute('aria-expanded', 'true');
    });
    expect(within(bookPanel('Mark')).getByText('Required')).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not show the plus button for Direct Scripture goals', async () => {
    renderForm({
      productType: 'DirectScriptureProduct',
      title: '',
      scriptureBooks: emptyScriptureBooks(),
    });
    await openScriptureSection();

    expect(screen.getByLabelText('Book')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Add scripture reference' })
    ).not.toBeInTheDocument();
  });
});
