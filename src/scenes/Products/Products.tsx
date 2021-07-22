import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { CreateProduct } from './Create';
import { ProductDetail } from './Detail';
import { EditProduct } from './Edit';

export const Products = () => (
  <Routes>
    <Route path="create" element={<CreateProduct />} />
    <Route path=":productId" element={<ProductDetail />} />
    <Route path=":productId/edit" element={<EditProduct />} />
    {NotFoundRoute}
  </Routes>
);
