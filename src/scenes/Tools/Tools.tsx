import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '~/components/Error';
import { ToolDetail } from './Detail';
import { ToolList } from './List';

export const Tools = () => (
  <Routes>
    <Route path="" element={<ToolList />} />
    <Route path=":toolId" element={<ToolDetail />} />
    {NotFoundRoute}
  </Routes>
);
