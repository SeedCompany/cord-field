import { Box } from '@mui/material';
import { getIn } from 'final-form';
import { ReactNode } from 'react';
import { useFormState } from 'react-final-form';
import { useFieldName } from './FieldGroup';

/**
 * Derives the warning message for a field's current value.
 * Return nothing when the value warrants no warning.
 */
export type WarningRule<Values, Context> = (
  values: Values,
  context: Context
) => ReactNode;

/**
 * A form's warning rules, keyed by the field each one describes.
 *
 * @remarks
 * Declare one of these per form so the message text has a single home. When a
 * new field needs a warning, add an entry here and render a {@link FieldWarning}
 * for it.
 */
export type WarningRules<Values, Context> = Record<
  string,
  WarningRule<Values, Context>
>;

/**
 * A non-blocking warning about a field's current value.
 *
 * @remarks
 * Warnings flag values, but unlike validation, they
 * never block submission and never need acknowledgement. The user is only
 * being asked to look twice.
 *
 * @example
 * Pass this as a field's `helperText` so the message lands in the space the
 * field already reserves for it:
 * ```tsx
 * <DateField
 *   name="disbursementCompleteDate"
 *   helperText={
 *     <FieldWarning
 *       name="disbursementCompleteDate"
 *       rules={EngagementWarnings}
 *       context={engagement}
 *     />
 *   }
 * />
 * ```
 */
export const FieldWarning = <Values, Context>({
  name,
  rules,
  context,
}: {
  name: string;
  rules: WarningRules<Values, Context>;
  context: Context;
}) => {
  const path = useFieldName(name);
  const { values, errors, submitErrors } = useFormState<Values>({
    subscription: { values: true, errors: true, submitErrors: true },
  });

  // A hard validation error outranks a warning. There is nothing to look
  // twice at while the value is outright invalid.
  if (getIn(errors ?? {}, path) || getIn(submitErrors ?? {}, path)) {
    return null;
  }

  const message = rules[name]?.(values, context);
  return message ? (
    <Box component="span" sx={{ color: 'warning.main' }}>
      {message}
    </Box>
  ) : null;
};
