import loadable from '@loadable/component';
import { CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { useIdentifyInLogRocket, useSession } from '../../components/Session';
import {
  AuthLayout,
  AuthWaiting,
  ForgotPassword,
  Login,
  Logout,
  Register,
  ResetPassword,
} from '../Authentication';
import { Home } from '../Home';
import { AppMetadata } from './AppMetadata';
import { MainLayout } from './MainLayout';
import { useNonProdWarning } from './useNonProdWarning';
import { useOldChromeWarning } from './useOldChromeWarning';

const Partners = loadable(() => import('../Partners'), {
  resolveComponent: (m) => m.Partners,
});
const Projects = loadable(() => import('../Projects'), {
  resolveComponent: (m) => m.Projects,
});
const Engagements = loadable(() => import('../Engagement'), {
  resolveComponent: (m) => m.Engagements,
});
const Products = loadable(() => import('../Products'), {
  resolveComponent: (m) => m.Products,
});
const ProgressReports = loadable(() => import('../ProgressReports'), {
  resolveComponent: (m) => m.ProgressReportRouter,
});
const Languages = loadable(() => import('../Languages'), {
  resolveComponent: (m) => m.Languages,
});
const Users = loadable(() => import('../Users'), {
  resolveComponent: (m) => m.Users,
});
const Locations = loadable(() => import('../Locations/Locations'), {
  resolveComponent: (m) => m.Locations,
});
const SearchResults = loadable(() => import('../SearchResults'), {
  resolveComponent: (m) => m.SearchResults,
});

export const Root = () => {
  useNonProdWarning();
  useOldChromeWarning();
  useIdentifyInLogRocket();
  const { sessionLoading } = useSession();

  const routes = sessionLoading ? (
    <AuthLayout>
      <AuthWaiting />
    </AuthLayout>
  ) : (
    <Routes>
      <Route key="main" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="partners/*" element={<Partners />} />
        <Route path="projects/*" element={<Projects />} />
        <Route path="engagements/*" element={<Engagements />} />
        <Route path="products/*" element={<Products />} />
        <Route path="progress-reports/*" element={<ProgressReports />} />
        <Route path="languages/*" element={<Languages />} />
        <Route path="users/*" element={<Users />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="locations/*" element={<Locations />} />
        {NotFoundRoute}
      </Route>
      <Route key="auth" element={<AuthLayout />}>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
      </Route>
    </Routes>
  );

  return (
    <>
      <CssBaseline />
      <AppMetadata />
      {routes}
    </>
  );
};
