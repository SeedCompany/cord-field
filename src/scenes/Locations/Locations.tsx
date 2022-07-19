import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { LocationDetail } from './Detail';

export const Locations = () => (
  <Routes>
    <Route path=":locationId" element={<LocationDetail />} />
    {NotFoundRoute}
  </Routes>
);
