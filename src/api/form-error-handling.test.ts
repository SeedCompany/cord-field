import { ApolloError } from '@apollo/client';
import { createForm, FORM_ERROR, FormApi } from 'final-form';
import { noop } from 'lodash';
import { ErrorHandlers, handleFormError } from './form-error-handling';

describe('handleFormError', () => {
  let error: ApolloError;
  let form: FormApi;

  beforeAll(() => {
    error = createError({
      message: 'Not found',
      codes: ['VerySpecific', 'NotFound', 'SomethingElse', 'Input', 'Client'],
    });
    form = createForm({
      onSubmit: noop,
      validate: () => undefined,
    });
  });

  it('forwards to next handler when asked', async () => {
    const result = await handleFormError(error, form, {
      NotFound: (e, next) => next(e),
      // Ignore error about key not existing - it's only for tests
      ...{ SomethingElse: 'nexted' },
    });
    expect(result).toEqual({ [FORM_ERROR]: 'nexted' });
  });

  it('skips to first handled code', async () => {
    const result = await handleFormError(error, form, {
      NotFound: 'woot',
    });
    expect(result).toEqual({ [FORM_ERROR]: 'woot' });
  });

  it('input with field uses field error', async () => {
    const inputError = createError({
      message: 'You messed up the foo bar',
      codes: ['Input'],
      field: 'foo.bar',
    });
    const result = await handleFormError(inputError, form);
    expect(result).toEqual({ foo: { bar: 'You messed up the foo bar' } });
  });

  it('input without field uses next', async () => {
    const inputError = createError({
      message: 'You messed up the foo bar',
      codes: ['Input'],
    });
    const result = await handleFormError(inputError, form, {
      // Default is next handled
      Default: 'Failed to update X thing',
    });
    expect(result).toEqual({ [FORM_ERROR]: 'Failed to update X thing' });
  });

  it('server errors return failure without message', async () => {
    const serverError = createError({
      message: 'Internal Server Error',
      codes: ['Server'],
    });
    const result = await handleFormError(serverError, form);
    expect(result).toEqual({});
  });

  it('default handlers can be skipped with undefined', async () => {
    const serverError = createError({
      message: 'Internal Server Error',
      codes: ['Server'],
    });
    const result = await handleFormError(serverError, form, {
      Server: undefined,
      Default: 'new default',
    });
    expect(result).toEqual({ [FORM_ERROR]: 'new default' });
  });

  it('default', async () => {
    const result = await handleFormError(error, form, {
      Default: 'new default',
    });
    expect(result).toEqual({ [FORM_ERROR]: 'new default' });
  });

  it('default default is error message', async () => {
    const result = await handleFormError(error, form);
    expect(result).toEqual({ [FORM_ERROR]: 'Not found' });
  });
});

const _testHandlerTypes: ErrorHandlers = {
  Validation: (e) => {
    const _msg: string = e.message;
    const _errors: Record<string, Record<string, string>> = e.errors;
  },
  Input: (e) => {
    const _msg: string = e.message;
    const _field: string | undefined = e.field;
  },
  Duplicate: (e) => {
    const _msg: string = e.message;
    const _field: string = e.field;
  },
};

const createError = ({
  message,
  codes,
  ...extensions
}: {
  message: string;
  codes: string[];
  [rest: string]: unknown;
}) => {
  return new ApolloError({
    graphQLErrors: [
      {
        message,
        extensions: {
          ...extensions,
          codes,
        },
        name: 'Error',
        locations: undefined,
        stack: undefined,
        path: undefined,
        originalError: undefined,
        nodes: undefined,
        positions: undefined,
        source: undefined,
      },
    ],
  });
};
