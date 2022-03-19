import { ApolloError } from '@apollo/client';
import { assert } from 'ts-essentials';

/**
 * This is a mapping of error codes to their error object.
 * This mapping should be expanded upon as we add and handle
 * new server errors.
 */
export interface ErrorMap {
  Validation: ValidationError;
  NotFound: InputError;
  TokenInvalid: ErrorInfo;
  TokenExpired: ErrorInfo;
  Input: InputError;
  Duplicate: DuplicateError;
  Unauthorized: InputError;

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

export type Code = keyof ErrorMap;

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

export const getErrorInfo = (e: unknown) => {
  if (!(e instanceof ApolloError) || !e.graphQLErrors[0]) {
    // This is really to make TS happy. We should always have an ApolloError here.
    assert(e instanceof Error);
    return {
      message: e.message,
      codes: ['Default'] as Code[],
    };
  }

  // For mutations we will assume they will only have one error
  // since they should only be doing one operation.
  const ext = e.graphQLErrors[0].extensions as {
    codes?: Code[];
    code?: Code;
  };
  const codes: Code[] = [
    ...(ext.codes ?? (ext.code ? [ext.code] : [])),
    'Default',
  ];
  return {
    message: e.message,
    ...ext,
    codes,
  };
};
