import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import {
  DraftOrganization,
  draftOrganization,
  isDraftOrganization,
} from './draftOrganization';

describe('draftOrganization', () => {
  it('creates a lookup item with a draft id and the given name', () => {
    const org = draftOrganization('Acme');

    expect(org.id.startsWith('draft:')).toBe(true);
    expect(org.name.value).toBe('Acme');
  });
});

describe('isDraftOrganization', () => {
  it('is true for a draft organization', () => {
    expect(isDraftOrganization(draftOrganization('Acme'))).toBe(true);
  });

  it('is false for a saved organization', () => {
    const saved = { ...draftOrganization('Acme'), id: 'org-1' };

    expect(isDraftOrganization(saved)).toBe(false);
  });
});

describe('DraftOrganization', () => {
  type Props = ComponentProps<typeof DraftOrganization>;

  const renderDraft = (props: Partial<Props>) => {
    const onSuccess = jest.fn();
    const onClose = jest.fn();
    render(
      <DraftOrganization
        open={true}
        initialValues={{ name: 'Acme' }}
        onSuccess={onSuccess}
        onClose={onClose}
        {...props}
      />
    );
    return { onSuccess, onClose };
  };

  it('selects a draft organization and closes when opened', () => {
    const { onSuccess, onClose } = renderDraft({});

    expect(onSuccess).toHaveBeenCalledTimes(1);
    const [org] = onSuccess.mock.calls[0];
    expect(isDraftOrganization(org)).toBe(true);
    expect(org.name.value).toBe('Acme');
    expect(onClose).toHaveBeenCalledWith('success', expect.anything());
  });

  it('does nothing when closed', () => {
    const { onSuccess, onClose } = renderDraft({ open: false });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does nothing without a name', () => {
    const { onSuccess, onClose } = renderDraft({ initialValues: { name: '' } });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
