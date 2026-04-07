import { gql } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { seedClient } from './seedClient';

export interface Rev79Community {
  id: string;
  name: string;
}

const QUERY = gql`
  query GetCommunitiesByProjectId($filter: JSONObject) {
    getCommunitiesByProjectId(filter: $filter) {
      id
      communitiesInUse {
        id
        name
      }
    }
  }
`;

interface Rev79ProjectsData {
  getCommunitiesByProjectId: Array<{
    id: string;
    communitiesInUse: Rev79Community[];
  }>;
}

export const useRev79Communities = (
  rev79ProjectId: string | null | undefined
) => {
  const { enqueueSnackbar } = useSnackbar();
  const [communities, setCommunities] = useState<Rev79Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!rev79ProjectId) {
      setCommunities([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    seedClient
      .query<Rev79ProjectsData>({
        query: QUERY,
        variables: { filter: { id: rev79ProjectId } },
      })
      .then(({ data }) => {
        if (!cancelled) {
          setCommunities(
            data.getCommunitiesByProjectId[0]?.communitiesInUse ?? []
          );
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err);
          setCommunities([]);
          enqueueSnackbar('Could not connect to Rev79', { variant: 'error' });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [rev79ProjectId, enqueueSnackbar]);

  return { communities, loading, error };
};
