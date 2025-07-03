import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { FieldRegionDetail } from './Detail';

export const FieldRegions = () => (
  <Routes>
    <Route path=":fieldRegionId" element={<FieldRegionDetail />} />
    {NotFoundRoute}
  </Routes>
);
