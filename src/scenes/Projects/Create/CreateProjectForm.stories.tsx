import { Button } from '@mui/material';
import { action } from '@storybook/addon-actions';
import { useDialog } from '../../../components/Dialog';
import { CreateProjectForm as Form } from './CreateProjectForm';

export default { title: 'Scenes/Projects' };

export const CreateProjectForm = () => {
  const [state, open] = useDialog();
  return (
    <>
      <Button onClick={open}>Create Project</Button>
      <Form onSubmit={action('onSubmit')} {...state} />
    </>
  );
};
