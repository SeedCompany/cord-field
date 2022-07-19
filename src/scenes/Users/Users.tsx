import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { UserDetail } from './Detail';
import { UserList } from './List';

export const Users = () => (
  <Routes>
    <Route path="" element={<UserList />} />
    <Route path=":userId" element={<UserDetail />} />
    {NotFoundRoute}
  </Routes>
);
