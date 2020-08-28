import { ApolloError } from '@apollo/client';
import { FORM_ERROR } from 'final-form';
import { ErrorHandlers, handleFormError } from './form-error-handling';

describe('handleFormError', () => {
  let error: ApolloError;

  beforeAll(() => {
    error = createError({
      message: 'Not found',
      codes: ['VerySpecific', 'NotFound', 'SomethingElse', 'Input', 'Client'],
    });
  });

  it('forwards to next handler when asked', async () => {
    const result = await handleFormError(error, {
      NotFound: (e, next) => next(e),
      // Ignore error about key not existing - it's only for tests
      ...{ SomethingElse: 'nexted' },
    });
    expect(result).toEqual({ [FORM_ERROR]: 'nexted' });
  });

  it('skips to first handled code', async () => {
    const result = await handleFormError(error, {
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
    const result = await handleFormError(inputError);
    expect(result).toEqual({ foo: { bar: 'You messed up the foo bar' } });
  });

  it('input without field uses next', async () => {
    const inputError = createError({
      message: 'You messed up the foo bar',
      codes: ['Input'],
    });
    const result = await handleFormError(inputError, {
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
    const result = await handleFormError(serverError);
    expect(result).toEqual({});
  });

  it('default handlers can be skipped with undefined', async () => {
    const serverError = createError({
      message: 'Internal Server Error',
      codes: ['Server'],
    });
    const result = await handleFormError(serverError, {
      Server: undefined,
      Default: 'new default',
    });
    expect(result).toEqual({ [FORM_ERROR]: 'new default' });
  });

  it('default', async () => {
    const result = await handleFormError(error, {
      Default: 'new default',
    });
    expect(result).toEqual({ [FORM_ERROR]: 'new default' });
  });

  it('default default is error message', async () => {
    const result = await handleFormError(error);
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
