import { ApolloError } from '@apollo/client';
import { FORM_ERROR, FormApi, setIn, SubmissionErrors } from 'final-form';
import { identity, mapValues } from 'lodash';
import { assert } from 'ts-essentials';
import { Promisable } from 'type-fest';

/**
 * This is a mapping of error codes to their error object.
 * This mapping should be expanded upon as we add and handle
 * new server errors.
 */
interface ErrorMap {
  Validation: ValidationError;
  NotFound: InputError;
  TokenInvalid: ErrorInfo;
  TokenExpired: ErrorInfo;
  Input: InputError;
  Duplicate: DuplicateError;

  /**
   * This is a special one that allows a default handler for any
   * un-handled error codes.
   */
  Client: ErrorInfo;
  /**
   * This is a special one that handles server errors. i.e. 500
   */
  Server: ErrorInfo;

  /**
   * This is a special one that allows a default handler for any
   * un-handled error codes.
   */
  Default: ErrorInfo;
}

type Code = keyof ErrorMap;

/**
 * The basic error shape
 */
interface ErrorInfo {
  message: string;
}

/**
 * Validation errors also give an errors object which contains
 * the fields errors.
 */
export interface ValidationError extends ErrorInfo {
  /**
   * All of the invalid fields and their errors.
   * Nested fields are flattened to `a.b` keys which is great for final-form.
   *
   * @example
   * {
   *   'user.email': {
   *     isEmail: 'email is not an email',
   *     ...
   *   },
   *   ...
   * }
   */
  errors: Record<string, Record<string, string>>;
}

export interface InputError extends ErrorInfo {
  field?: string;
}

export type DuplicateError = Required<InputError>;

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
  | ((e: E, next: NextHandler<E>) => Promisable<ErrorHandlerResult>);

type NextHandler<E> = (e: E) => Promisable<ErrorHandlerResult>;
export type ErrorHandlerResult = string | SubmissionErrors | undefined;

const expandDotNotation = (input: Record<string, any>) =>
  Object.entries(input).reduce(
    (out, [key, value]) => setIn(out, key, value),
    {}
  );

// We'll just use the first human error string for each field
export const renderValidationErrors = (e: ValidationError) =>
  expandDotNotation(mapValues(e.errors, (er) => Object.values(er)[0]));

/**
 * These are the default handlers which are used as fallbacks
 * when handlers are not specified.
 */
const defaultHandlers: ErrorHandlers = {
  Validation: renderValidationErrors,
  Input: (e, next) => (e.field ? setIn({}, e.field, e.message) : next(e)),
  Duplicate: (e) => setIn({}, e.field, e.message),

  // Assume server errors are handled separately
  // Return failure but no error message
  Server: {},
  Default: ({ message }) => message,
};

/**
 * Handles the error according to the form error handlers passed in.
 */
export const handleFormError = async <T, P>(
  e: unknown,
  form: FormApi<T, P>,
  handlers?: ErrorHandlers
) => {
  const error = getErrorInfo(e);

  const mergedHandlers = { ...defaultHandlers, ...handlers };
  const handler = error.codes
    // get handler for each code
    .map((c) => mergedHandlers[c])
    // remove unhandled codes
    .filter(identity)
    // normalize handlers to a standard function shape
    .map(resolveHandler)
    // In order to build the next function for each handler we need to start
    // from the end and work backwards
    .reverse()
    // Compose the chain of handlers into a single function.
    // In a way, this converts [a, b, c] into a(b(c()))
    .reduce(
      (prev, handler) =>
        // Return a new function with the handler's next function scoped into it
        (e) => handler(e, prev),
      // Start with a noop next handler
      (() => undefined) as NextHandler<any>
    );
  return handler(error);
};

const getErrorInfo = (e: unknown) => {
  if (!(e instanceof ApolloError) || e.graphQLErrors.length === 0) {
    // This is really to make TS happy. We should always have an ApolloError here.
    assert(e instanceof Error);
    return {
      message: e.message,
      codes: ['Default'] as Code[],
    };
  }

  // For mutations we will assume they will only have one error
  // since they should only be doing one operation.
  const ext = e.graphQLErrors[0].extensions ?? {};
  const codes: Code[] = [...(ext.codes ?? [ext.code]), 'Default'];
  return {
    message: e.message,
    ...ext,
    codes,
  };
};

/**
 * Normalize the handler to a function and normalize string results.
 */
const resolveHandler = <E>(handler: ErrorHandler<E>) => async (
  error: E,
  next: NextHandler<E>
) => {
  const result =
    typeof handler === 'function' ? await handler(error, next) : handler;
  return typeof result === 'string' ? { [FORM_ERROR]: result } : result;
};
