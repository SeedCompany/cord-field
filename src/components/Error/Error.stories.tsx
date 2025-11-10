import { ApolloError } from '@apollo/client';
import { boolean } from '@storybook/addon-knobs';
import { Error as ErrorComponent } from './Error';

export default { title: 'Components/Error' };

const apolloErrorInstance = new ApolloError({
  graphQLErrors: [
    {
      message: 'error message',
      extensions: { codes: ['NotFound'] },
    },
  ],
});

export const Error = () => (
  <ErrorComponent
    error={boolean('Not Found', true) ? apolloErrorInstance : undefined}
    children={''}
  />
);
