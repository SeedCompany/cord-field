import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { ToolDetail } from './Detail';

export const Tools = () => (
  <Routes>
    <Route path=":toolId" element={<ToolDetail />} />
    {NotFoundRoute}
  </Routes>
);
