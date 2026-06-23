import { GridColDef } from '@mui/x-data-grid-pro';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  columnsToFilterControls,
  columnsToSortOptions,
} from './gridColumnAdapters';
import {
  MobileFilterButton,
  MobileFilterProvider,
  useRowListFilters,
} from './MobileFilters';

const cols = [
  { field: 'name', headerName: 'Name' },
  { field: 'status', headerName: 'Status' },
] as unknown as GridColDef[];

// A stand-in row list that registers its controls + sort with the provider,
// the same way a scene's renderList does via EntityList.
const RegisterList = () => {
  useRowListFilters(columnsToFilterControls(cols), {
    options: columnsToSortOptions(cols),
    default: { field: 'name', direction: 'ASC' },
  });
  return null;
};

const setup = () =>
  render(
    <MobileFilterProvider>
      <RegisterList />
      <MobileFilterButton />
    </MobileFilterProvider>
  );

const openDrawer = async () =>
  fireEvent.click(await screen.findByRole('button', { name: 'Filters' }));

describe('MobileFilterButton', () => {
  it('keeps "Clear all" disabled until something changes', async () => {
    setup();
    await openDrawer();
    expect(screen.getByRole('button', { name: 'Clear all' })).toBeDisabled();
  });

  it('enables "Clear all" after a sort-only change and resets it', async () => {
    setup();
    await openDrawer();
    const clearAll = screen.getByRole('button', { name: 'Clear all' });
    expect(clearAll).toBeDisabled();

    // Change only the sort direction — no filters touched.
    fireEvent.click(screen.getByRole('button', { name: 'Descending' }));
    await waitFor(() => expect(clearAll).toBeEnabled());

    // Clearing resets the sort back to its default.
    fireEvent.click(clearAll);
    await waitFor(() => expect(clearAll).toBeDisabled());
  });
});
