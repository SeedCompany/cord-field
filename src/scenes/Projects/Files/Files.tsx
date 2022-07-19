import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../../components/Error';
import { ProjectFilesList } from './ProjectFilesList';

export const Files = () => (
  <Routes>
    <Route path="" element={<ProjectFilesList />} />
    <Route path=":folderId" element={<ProjectFilesList />} />
    {NotFoundRoute}
  </Routes>
);
