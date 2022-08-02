import { ApolloError } from '@apollo/client';
import { boolean } from '@storybook/addon-knobs';
import { GraphQLError } from 'graphql';
import { Error as ErrorComponent } from './Error';

export default { title: 'Components/Error' };

const apolloErrorInstance = new ApolloError({
  graphQLErrors: [
    new GraphQLError(
      'error message',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { code: 'NOT_FOUND' }
    ),
  ],
});

export const Error = () => (
  <ErrorComponent
    error={boolean('Not Found', true) ? apolloErrorInstance : undefined}
    children={''}
  />
);
