import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';
import { PartnerLanguagesSection } from './PartnerLanguagesSection';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeLang = (name: string, displayName = name) => ({
  __typename: 'Language' as const,
  id: `lang-${name}`,
  name: { __typename: 'SecuredString' as const, value: name },
  displayName: { __typename: 'SecuredString' as const, value: displayName },
  ethnologue: {
    __typename: 'EthnologueLanguage' as const,
    code: { __typename: 'SecuredStringNullable' as const, value: null },
  },
  registryOfLanguageVarietiesCode: {
    __typename: 'SecuredStringNullable' as const,
    value: null,
  },
});

const makePartner = (
  overrides: Partial<{
    languageOfReporting: object;
    languageOfWiderCommunication: object;
    languagesOfConsulting: object;
  }> = {}
) =>
  ({
    languageOfReporting: { canRead: true, canEdit: true, value: null },
    languageOfWiderCommunication: { canRead: true, canEdit: true, value: null },
    languagesOfConsulting: { canRead: true, canEdit: true, value: [] },
    ...overrides,
  } as unknown as PartnerDetailsFragment);

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PartnerLanguagesSection', () => {
  it('renders the section title', () => {
    render(
      <PartnerLanguagesSection partner={makePartner()} onEdit={jest.fn()} />
    );
    expect(screen.getByText('Languages')).toBeInTheDocument();
  });

  it('renders all three field labels', () => {
    render(
      <PartnerLanguagesSection partner={makePartner()} onEdit={jest.fn()} />
    );
    expect(screen.getByText('Language of Reporting')).toBeInTheDocument();
    expect(
      screen.getByText('Language of Wider Communication')
    ).toBeInTheDocument();
    expect(screen.getByText('Languages of Consulting')).toBeInTheDocument();
  });

  it('shows "None" for each empty field', () => {
    render(
      <PartnerLanguagesSection partner={makePartner()} onEdit={jest.fn()} />
    );
    expect(screen.getAllByText('None')).toHaveLength(3);
  });

  it('displays language of reporting by name', () => {
    const partner = makePartner({
      languageOfReporting: {
        canRead: true,
        canEdit: true,
        value: makeLang('French'),
      },
    });
    render(<PartnerLanguagesSection partner={partner} onEdit={jest.fn()} />);
    expect(screen.getByText('French')).toBeInTheDocument();
  });

  it('displays language of wider communication by name', () => {
    const partner = makePartner({
      languageOfWiderCommunication: {
        canRead: true,
        canEdit: true,
        value: makeLang('Spanish'),
      },
    });
    render(<PartnerLanguagesSection partner={partner} onEdit={jest.fn()} />);
    expect(screen.getByText('Spanish')).toBeInTheDocument();
  });

  it('displays languages of consulting as a list', () => {
    const partner = makePartner({
      languagesOfConsulting: {
        canRead: true,
        canEdit: true,
        value: [makeLang('German'), makeLang('Arabic')],
      },
    });
    render(<PartnerLanguagesSection partner={partner} onEdit={jest.fn()} />);
    expect(screen.getByText('German')).toBeInTheDocument();
    expect(screen.getByText('Arabic')).toBeInTheDocument();
  });

  it('falls back to displayName when language name value is null', () => {
    const lang = {
      ...makeLang('ignored', 'Display-Only Name'),
      name: { __typename: 'SecuredString' as const, value: null },
    };
    const partner = makePartner({
      languageOfReporting: { canRead: true, canEdit: true, value: lang },
    });
    render(<PartnerLanguagesSection partner={partner} onEdit={jest.fn()} />);
    expect(screen.getByText('Display-Only Name')).toBeInTheDocument();
  });

  it('calls onEdit when the edit button is clicked', async () => {
    const onEdit = jest.fn();
    const partner = makePartner({
      languageOfReporting: { canRead: true, canEdit: true, value: null },
    });
    render(<PartnerLanguagesSection partner={partner} onEdit={onEdit} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('disables the edit button when no fields are editable', () => {
    const partner = makePartner({
      languageOfReporting: { canRead: true, canEdit: false, value: null },
      languageOfWiderCommunication: {
        canRead: true,
        canEdit: false,
        value: null,
      },
      languagesOfConsulting: { canRead: true, canEdit: false, value: [] },
    });
    render(<PartnerLanguagesSection partner={partner} onEdit={jest.fn()} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
