import { useLocation } from 'react-router-dom';
import { useNavigate } from '../../components/Routing';
import { useSession } from '../../components/Session';
import { useIsomorphicEffect } from '../../hooks';

export const useAuthRequired = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, sessionLoading } = useSession();

  useIsomorphicEffect(() => {
    if (!session && !sessionLoading) {
      const current = location.pathname + location.search + location.hash;
      const returnTo =
        current !== '/' ? encodeURIComponent(current) : undefined;
      const search = returnTo ? `?returnTo=${returnTo}` : undefined;
      navigate({ pathname: '/login', search }, { replace: true });
    }
  }, [session, sessionLoading, navigate, location]);
};
