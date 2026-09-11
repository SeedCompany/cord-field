import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setIn, SubmissionErrors, ValidationErrors } from 'final-form';
import { noop } from 'lodash';
import { ReactNode } from 'react';
import { Field, Form } from 'react-final-form';
import { FieldGroup } from './FieldGroup';
import { FieldWarning, WarningRules } from './FieldWarnings';

interface Values {
  date?: string;
}

const warn = (message: ReactNode): WarningRules<Values, string> => ({
  date: (values) => (values.date === 'suspicious' ? message : undefined),
});

const renderWarning = ({
  rules,
  validate,
  onSubmit = noop,
  initialValues = { date: 'suspicious' },
}: {
  rules: WarningRules<Values, string>;
  validate?: (values: Values) => ValidationErrors;
  onSubmit?: (values: Values) => SubmissionErrors | void;
  initialValues?: Values;
}) =>
  render(
    <Form onSubmit={onSubmit} initialValues={initialValues} validate={validate}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Field name="date" component="input" />
          <FieldWarning name="date" rules={rules} context="engagement" />
          <button type="submit">Save</button>
        </form>
      )}
    </Form>
  );

describe('FieldWarning', () => {
  it('renders the message its rule returns', () => {
    renderWarning({ rules: warn('Double check this date') });

    expect(screen.getByText('Double check this date')).toBeInTheDocument();
  });

  it('renders nothing when the rule returns no message', () => {
    renderWarning({
      rules: warn('Double check this date'),
      initialValues: { date: 'fine' },
    });

    expect(
      screen.queryByText('Double check this date')
    ).not.toBeInTheDocument();
  });

  it('renders nothing when the field has no rule at all', () => {
    renderWarning({ rules: {} });

    expect(
      screen.queryByText('Double check this date')
    ).not.toBeInTheDocument();
  });

  // A hard error outranks a warning, and this has to hold even before the field
  // is touched. `showError` waits for a touch, so without FieldWarning's own
  // check the warning would show alongside a pending error.
  it('stays hidden while the field has a validation error, touched or not', () => {
    renderWarning({
      rules: warn('Double check this date'),
      validate: () => ({ date: 'Date is invalid' }),
    });

    expect(
      screen.queryByText('Double check this date')
    ).not.toBeInTheDocument();
  });

  it('stays hidden while the field has a submit error', async () => {
    renderWarning({
      rules: warn('Double check this date'),
      onSubmit: () => ({ date: 'Server rejected this date' }),
    });

    expect(screen.getByText('Double check this date')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(
        screen.queryByText('Double check this date')
      ).not.toBeInTheDocument();
    });
  });

  // The rules map is keyed by the bare field name and the rule is handed the
  // whole form values, but errors are read at the group's prefixed path.
  describe('inside a FieldGroup', () => {
    const groupedRules: WarningRules<{ ceremony: Values }, string> = {
      date: (values) =>
        values.ceremony.date === 'suspicious'
          ? 'Double check this date'
          : undefined,
    };

    const renderGrouped = (validate?: () => ValidationErrors) =>
      render(
        <Form
          onSubmit={noop}
          initialValues={{ ceremony: { date: 'suspicious' } }}
          validate={validate}
        >
          {() => (
            <FieldGroup prefix="ceremony">
              <FieldWarning
                name="date"
                rules={groupedRules}
                context="engagement"
              />
            </FieldGroup>
          )}
        </Form>
      );

    it('looks the rule up by the bare name and passes whole form values', () => {
      renderGrouped();

      expect(screen.getByText('Double check this date')).toBeInTheDocument();
    });

    it('hides the warning for an error at the prefixed path', () => {
      renderGrouped(() => setIn({}, 'ceremony.date', 'Date is invalid'));

      expect(
        screen.queryByText('Double check this date')
      ).not.toBeInTheDocument();
    });
  });
});
