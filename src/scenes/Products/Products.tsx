import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { CreateProduct } from './Create';
import { EditProduct } from './Edit';

export const Products = () => (
  <Routes>
    <Route path="create" element={<CreateProduct />} />
    <Route path=":productId" element={<EditProduct />} />
    {NotFoundRoute}
  </Routes>
);
