import { SnackbarProvider } from 'notistack';
import React from 'react';
import { ApolloProvider } from '../../../api';
import { Sidebar as SidebarComponent } from './Sidebar';

export default { title: 'Scenes/Root' };

export const Sidebar = () => (
  <SnackbarProvider>
    <ApolloProvider>
      <SidebarComponent />
    </ApolloProvider>
  </SnackbarProvider>
);
