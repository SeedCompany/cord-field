import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';

jest.mock('./SidebarContent', () => ({
  SidebarContent: () => (
    <button type="button" data-testid="sidebar-focusable">
      Sidebar Focusable
    </button>
  ),
}));

describe('Sidebar', () => {
  it('keeps collapsed controls out of keyboard navigation in old and modern browsers', async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button">Before</button>
        <Sidebar open={false} />
        <button type="button">After</button>
      </>
    );

    const before = screen.getByRole('button', { name: 'Before' });
    const after = screen.getByRole('button', { name: 'After' });
    const hiddenFocusable = screen.getByTestId('sidebar-focusable');
    const sidebarPaper = hiddenFocusable.closest('.MuiPaper-root');

    if (!sidebarPaper) {
      throw new Error('Expected Sidebar root Paper element');
    }

    expect(sidebarPaper).toHaveAttribute('inert');
    expect(sidebarPaper).toHaveAttribute('aria-hidden', 'true');

    before.focus();
    expect(before).toHaveFocus();

    await user.tab();
    expect(after).toHaveFocus();
    expect(hiddenFocusable).not.toHaveFocus();
  });
});
