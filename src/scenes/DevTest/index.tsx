import React from 'react';
import { useTitle } from '../../components/title';
import {
  useGetTestUserQuery,
  useUpdateTestUserMutation,
} from '../../generated/graphql';

export const DevTest = () => {
  useTitle('Developer Test Scene');

  const [updateUser] = useUpdateTestUserMutation();

  const { loading, data, error } = useGetTestUserQuery({
    variables: {
      id: 'Br1jgSNR2L',
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.log('error', error.graphQLErrors);
    return (
      <>
        ERRORS:{' '}
        <ul>
          {error.graphQLErrors.map(({ message }: any) => (
            <li key={message.error}>
              status code: {message.statusCode}, error: {message.error}
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <div>
      DEV TEST SCENE
      <br />
      <br />
      data: <pre>{JSON.stringify(data?.user, null, 4)}</pre>
      <br />
      <br />
      <button
        onClick={async (_) => {
          await updateUser({
            variables: {
              id: 'Br1jgSNR2L',
              realFirstName: 'Test User',
            },
          });
        }}
      >
        update user
      </button>
    </div>
  );
};
