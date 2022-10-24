import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { ProductDetail } from './Detail';
import { EditProduct } from './Edit';

export const Products = () => (
  <Routes>
    <Route path=":productId/*" element={<Detail />} />
    {NotFoundRoute}
  </Routes>
);

const Detail = () => (
  // <ChangesetContext>
  <Routes>
    <Route path="" element={<ProductDetail />} />
    <Route path="edit" element={<EditProduct />} />
    {NotFoundRoute}
  </Routes>
  // </ChangesetContext>
);
