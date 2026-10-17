import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '~/theme/ThemeProvider';
import { ProductDetailFragment } from './ProductDetail.graphql';
import { ProductInfo } from './ProductInfo';

// The API merges ranges that touch, so two full books come back as one range
const matthewToMark = {
  start: { book: 'Matthew', chapter: 1, verse: 1 },
  end: { book: 'Mark', chapter: 16, verse: 20 },
};

function renderInfo(scriptureReferences: readonly unknown[]) {
  const product = {
    __typename: 'DirectScriptureProduct',
    mediums: { value: [] },
    methodology: { value: null },
    describeCompletion: { value: null },
    steps: { value: [] },
    scriptureReferences: { value: scriptureReferences },
    progressOfCurrentReportDue: null,
    engagement: { partnershipsProducingMediums: { items: [] } },
  } as unknown as ProductDetailFragment;

  render(
    <ThemeProvider>
      <MemoryRouter>
        <ProductInfo product={product} />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('ProductInfo', () => {
  it('shows one scripture row per book', () => {
    renderInfo([matthewToMark]);

    expect(screen.getByText('Matthew')).toBeVisible();
    expect(screen.getByText('Mark')).toBeVisible();
  });

  it('labels a partial book with its range', () => {
    renderInfo([
      {
        start: { book: 'Mark', chapter: 1, verse: 1 },
        end: { book: 'Mark', chapter: 2, verse: 5 },
      },
    ]);

    expect(screen.getByText('Mark 1:1–2:5')).toBeVisible();
  });
});
