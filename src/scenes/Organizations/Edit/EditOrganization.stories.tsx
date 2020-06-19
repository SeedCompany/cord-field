import { Button } from '@material-ui/core';
import { text } from '@storybook/addon-knobs';
import React from 'react';
import { useDialog } from '../../../components/Dialog';
import { EditOrganization as Form } from './EditOrganization';

export default { title: 'Scenes/Organizations/Detail' };

export const EditOrganizationForm = () => {
  const [state, open] = useDialog();
  return (
    <>
      <Button onClick={open}>Edit Partner</Button>
      <Form {...state} orgId={text('Org Id', '')} />
    </>
  );
};
