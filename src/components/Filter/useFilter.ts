import qs from 'qs';
import { useLocation, useNavigate } from 'react-router-dom';

export const useFilter = <T>() => {
  const navigate = useNavigate();
  const location = useLocation();
  const values = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  }) as Partial<T>;

  const onChange = (values: Partial<T>) => {
    const queryVals = qs.stringify(values, {
      addQueryPrefix: true,
      arrayFormat: 'comma',
    });

    navigate(queryVals, {
      replace: true,
    });
  };

  return { values, onChange };
};
