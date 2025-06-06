import { ApolloError } from '@apollo/client';
import { assert } from 'ts-essentials';
import { IdFragment } from '~/common';
import { GqlTypeMapMain } from '../schema';
import { ProductStep } from '../schema.graphql';

interface CordErrorExtensions {
  codes: readonly Code[];
  stacktrace?: readonly string[];
}

declare module 'graphql/error/GraphQLError' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GraphQLErrorExtensions extends CordErrorExtensions {}
}

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
  MissingRequiredFields: MissingRequiredFieldsError;
  StepNotPlanned: StepNotPlannedError;
  DateOverrideConflict: DateOverrideConflictError;

  /**
   * This is a special one that allows a default handler for any
   * un-handled error codes.
   */
  Client: ErrorInfo;
  /**
   * This is a special one that handles server errors. i.e. 500
   */
  Server: ErrorInfo;

  // Error in GraphQL schema.
  // Could be a Client or Server error not fulfilling the schema.
  GraphQL: unknown;

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
interface ErrorInfo extends CordErrorExtensions {
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

export interface MissingRequiredFieldsError extends InputError {
  readonly resource: { name: keyof GqlTypeMapMain };
  readonly object: { id: string };
  readonly missing: ReadonlyArray<
    Readonly<{
      field: string;
      description: string;
    }>
  >;
}

export interface StepNotPlannedError extends InputError {
  field: string;
  productId: string;
  step: ProductStep;
  index: number;
}

export interface DateOverrideConflictError extends InputError {
  readonly object: IdFragment;
  readonly canonical: Record<'start' | 'end', string | null>;
  readonly conflicts: ReadonlyArray<
    Readonly<{
      __typename: keyof GqlTypeMapMain;
      id: string;
      label: string;
      point: 'start' | 'end';
      date: string;
    }>
  >;
}

export const isErrorCode = <K extends keyof ErrorMap>(
  errorInfo: ErrorInfo,
  code: K
): errorInfo is ErrorInfo & ErrorMap[K] => errorInfo.codes.includes(code);

export const getErrorInfo = (e: unknown): ErrorInfo => {
  if (!(e instanceof ApolloError) || !e.graphQLErrors[0]) {
    // This is really to make TS happy. We should always have an ApolloError here.
    assert(e instanceof Error);
    return {
      message: e.message,
      codes: ['Default'] as Code[],
    };
  }

  // For mutations, we will assume they will only have one error
  // since they should only be doing one operation.
  const ext = e.graphQLErrors[0].extensions;
  const codes = [...ext.codes, 'Default' as const];
  return {
    message: e.message,
    ...ext,
    codes,
  };
};
