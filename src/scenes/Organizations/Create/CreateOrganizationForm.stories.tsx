import { Button } from '@material-ui/core';
import { action } from '@storybook/addon-actions';
import { useDialog } from '../../../components/Dialog';
import { CreateOrganizationForm as Form } from './CreateOrganizationForm';

export default { title: 'Scenes/Organizations' };

export const CreateOrganizationForm = () => {
  const [state, open] = useDialog();
  return (
    <>
      <Button onClick={open}>Create Partner</Button>
      <Form onSubmit={action('onSubmit')} {...state} />
    </>
  );
};
