import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { FieldZoneDetail } from './Detail';

export const FieldZones = () => (
  <Routes>
    <Route path=":fieldZoneId" element={<FieldZoneDetail />} />
    {NotFoundRoute}
  </Routes>
);
