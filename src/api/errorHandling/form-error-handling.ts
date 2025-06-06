import { groupBy, isNotFalsy, mapValues } from '@seedcompany/common';
import { FORM_ERROR, FormApi, setIn, SubmissionErrors } from 'final-form';
import { isValidElement, ReactElement } from 'react';
import { Promisable } from 'type-fest';
import { ErrorMap, getErrorInfo, ValidationError } from './error.types';

/**
 * A mapping where the key is the error code from the server
 * and the value is an ErrorHandler.
 */
export type ErrorHandlers = {
  [Code in keyof ErrorMap]?: ErrorHandler<ErrorMap[Code]> | undefined;
};

/**
 * Error handlers are very flexible in order to reduce boilerplate.
 *
 * They can be just strings, which will produce a form level error.
 * These go straight to the `<FormError />` component.
 * @example
 * TokenExpired: 'Password request has expired'
 *
 * They can be objects, which will produce field level errors.
 * @example
 * Duplicate: {
 *   email: 'This email is already in use'
 * }
 *
 * They can be undefined, which will ignore the error.
 * Final form will treat this as a successful submission.
 * @example
 * NotSureWhy: undefined, // handled some other way maybe?
 *
 * They can also be functions (sync or async) that are given the error
 * object and return any of the above examples.
 * @example
 * Validation: (e) => {
 *   if (e.errors.password) {
 *     return { password: 'Password needs to be stronger' };
 *   }
 *   if (e.errors.email) {
 *     // excuse the very contrived async example
 *     return await whyIsThisEmailInvalid(e.errors.email);
 *   }
 *   return 'Generic form error';
 * }
 */
export type ErrorHandler<E> =
  | ErrorHandlerResult
  | ((
      e: E,
      next: NextHandler<E>,
      utils: HandlerUtils
    ) => Promisable<ErrorHandlerResult>);

type NextHandler<E> = (e: E) => Promisable<ErrorHandlerResult>;
export type ErrorHandlerResult =
  | string
  | ReactElement
  | SubmissionErrors
  | undefined;

interface HandlerUtils {
  /** Does the form have this field registered? */
  hasField: (field: string) => boolean;
  /** Finds a registered field matching the given name */
  findField: (field: string | RegExp) => string | undefined;
}

const expandDotNotation = (input: Record<string, any>) =>
  Object.entries(input).reduce(
    (out, [key, value]) => setIn(out, key, value),
    {}
  );

// We'll just use the first human error string for each field
export const renderValidationErrors = (e: ValidationError) =>
  expandDotNotation(
    mapValues(e.errors, (_, er) => Object.values(er)[0]).asRecord
  );

/**
 * These are the default handlers which are used as fallbacks
 * when handlers are not specified.
 */
export const defaultHandlers = {
  Validation: renderValidationErrors,
  Input: (e, next, { hasField }) =>
    e.field && hasField(e.field) ? setIn({}, e.field, e.message) : next(e),
  Duplicate: (e, next, { hasField }) =>
    hasField(e.field) ? setIn({}, e.field, 'Already in use') : next(e),
  MissingRequiredFields: (e, next, { findField }) => {
    const { in: inForm, out: outOfForm } = e.missing.reduce(
      (res, missing) => {
        const formFieldName =
          findField(missing.field) ??
          // Also find with a path prefix: mouStart -> project.mouStart
          findField(RegExp(`\\.${missing.field}$`)) ??
          // Also find with Id suffix: primaryLocation -> primaryLocationId
          findField(missing.field + 'Id') ??
          findField(RegExp(`\\.${missing.field}Id$`));
        if (formFieldName) {
          res.in.push({
            ...missing,
            field: formFieldName,
          });
        } else {
          res.out.push(missing);
        }
        return res;
      },
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      { in: [], out: [] } as Record<
        'in' | 'out',
        Array<(typeof e.missing)[number]>
      >
    );
    return {
      ...inForm.reduce(
        (res, missing) =>
          setIn(res, missing.field, 'Required when ' + missing.description),
        {}
      ),
      ...(outOfForm.length > 0 && {
        [FORM_ERROR]: groupBy(outOfForm, (x) => x.description)
          .map((fields) =>
            [
              `The following fields are required when ${fields[0].description}:`,
              ...fields.map((x) => `  - ${x.field}`),
            ].join('\n')
          )
          .join('\n\n'),
      }),
    };
  },

  // Assume server errors are handled separately
  // Return failure but no error message
  Server: {},
  Default: ({ message }) => {
    console.error(message);
    return message;
  },
} satisfies ErrorHandlers;

/**
 * Handles the error according to the form error handlers passed in.
 */
export const handleFormError = async <T, P>(
  e: unknown,
  form: FormApi<T, P>,
  handlers?: ErrorHandlers
) => {
  const error = getErrorInfo(e);

  const utils: HandlerUtils = {
    hasField: (field) => form.getRegisteredFields().includes(field),
    findField: makeFindField(form.getRegisteredFields()),
  };

  const mergedHandlers = { ...defaultHandlers, ...handlers };
  const handler = error.codes
    // get handler for each code
    .map((c) => mergedHandlers[c])
    // remove unhandled codes
    .filter(isNotFalsy)
    // normalize handlers to a standard function shape
    .map((h) => resolveHandler(h, utils))
    // In order to build the next function for each handler we need to start
    // from the end and work backwards
    .reverse()
    // Compose the chain of handlers into a single function.
    // In a way, this converts [a, b, c] into a(b(c()))
    .reduce(
      (prev, handler) =>
        // Return a new function with the handler's next function scoped into it
        (e) =>
          handler(e, prev),
      // Start with a noop next handler
      (() => undefined) as NextHandler<any>
    );
  return await handler(error);
};

/**
 * Normalize the handler to a function and normalize string results.
 */
const resolveHandler =
  <E>(handler: ErrorHandler<E>, utils: HandlerUtils) =>
  async (error: E, next: NextHandler<E>) => {
    const result =
      typeof handler === 'function'
        ? await handler(error, next, utils)
        : handler;
    return typeof result === 'string' || isValidElement(result)
      ? { [FORM_ERROR]: result }
      : result;
  };

const makeFindField = (fields: readonly string[]) => (field: string | RegExp) =>
  typeof field === 'string' && fields.includes(field)
    ? field
    : fields.find((f) => f.match(field));
