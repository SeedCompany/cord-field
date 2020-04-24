import { ApolloError } from '@apollo/client';
import { FORM_ERROR, SubmissionErrors } from 'final-form';
import { mapValues } from 'lodash';
import { Promisable } from 'type-fest';

/**
 * This is a mapping of error codes to their error object.
 * This mapping should be expanded upon as we add and handle
 * new server errors.
 */
interface ErrorMap {
  Validation: ValidationError;
  NotFound: ClientError;
  TokenInvalid: ClientError;
  TokenExpired: ClientError;

  /**
   * This is a special one that allows a default handler for any
   * un-handled error codes.
   */
  Default: ClientError;
  /**
   * This is a special one that handles server errors. i.e. 500
   */
  Server: unknown;
}

/**
 * The basic error shape
 */
interface ClientError {
  message: string;
}

/**
 * Validation errors also give an errors object which contains
 * the fields errors.
 */
export interface ValidationError extends ClientError {
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

/**
 * A mapping where the key is the error code from the server
 * and the value is an ErrorHandler.
 */
export type ErrorHandlers = {
  [Code in keyof ErrorMap]?: ErrorHandler<ErrorMap[Code]>;
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
  | ((e: E) => Promisable<ErrorHandlerResult>);

export type ErrorHandlerResult = string | SubmissionErrors | undefined;

// We'll just use the first human error string for each field
export const renderValidationErrors = (e: ValidationError) =>
  mapValues(e.errors, (er) => Object.values(er)[0]);

/**
 * These are the default handles which are used as fallbacks
 * when handlers are not specified.
 * Note that these that precedence over the `Default` handler.
 * So `Validation` will never use the `Default` handler since it defaulted here.
 */
const defaultHandlers: ErrorHandlers = {
  Validation: renderValidationErrors,

  // Assume server errors are handled separately
  // Return failure but no error message
  Server: {},
};

/**
 * Handles the error according to the form error handlers passed in.
 */
export const handleFormError = async (e: unknown, handlers?: ErrorHandlers) => {
  if (!isClientError(e)) {
    const handler = handlers?.Server ?? defaultHandlers?.Server;
    return invokeHandler(handler, e);
  }

  const { message, extensions = {} } = e.graphQLErrors[0];
  const code = extensions.code as Exclude<keyof ErrorMap, 'Server' | 'Default'>;
  const error: ErrorMap[typeof code] = {
    message,
    ...extensions,
  };

  const handler =
    handlers?.[code] ??
    defaultHandlers?.[code] ??
    handlers?.Default ??
    (({ message }: { message: string }) => message);

  return invokeHandler(handler, error);
};

const isClientError = (e: unknown): e is ApolloError => {
  if (!(e instanceof ApolloError) || !e.graphQLErrors?.[0]) {
    return false;
  }
  // For mutations we will assume they will only have one error
  // since they should only be doing one operation.
  const status = e.graphQLErrors[0].extensions?.status;
  return status && status >= 400 && status < 500;
};

/**
 * Handle the flexibility of error handler.
 */
const invokeHandler = async (
  handler: ErrorHandler<unknown>,
  error: unknown
): Promise<SubmissionErrors | undefined> => {
  const result = typeof handler === 'function' ? await handler(error) : handler;
  return typeof result === 'string' ? { [FORM_ERROR]: result } : result;
};
