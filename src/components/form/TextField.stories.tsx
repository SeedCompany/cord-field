import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { Form } from 'react-final-form';
import { TextField as TF } from './TextField';

export default { title: 'Components/Forms/Fields' };

export const Text = () => (
  <Form onSubmit={action('onSubmit')}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <TF
          name="firstName"
          label={text('Label', 'First Name')}
          placeholder={text('Placeholder', 'Enter First Name')}
          required={boolean('Required', true)}
          disabled={boolean('Disabled', false)}
          fullWidth={boolean('Full Width', true)}
          helperText={text('Helper Text', 'TextField')}
          onClick={action('click')}
        />
      </form>
    )}
  </Form>
);
