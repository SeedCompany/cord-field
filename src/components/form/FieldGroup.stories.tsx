import { TextField } from '@material-ui/core';
import { action } from '@storybook/addon-actions';
import { Form } from 'react-final-form';
import { FieldGroup as FG } from './FieldGroup';

export default { title: 'Components/Forms' };

export const FieldGroup = () => (
  <Form onSubmit={action('onSubmit')}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <FG prefix="user">
          <TextField
            name="firstName"
            label="First Name"
            placeholder="Enter First Name"
          />
          <TextField
            name="lastName"
            label="Last Name"
            placeholder="Enter Last Name"
          />
        </FG>
      </form>
    )}
  </Form>
);
