import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { Form } from 'react-final-form';
import { PasswordField as PF } from './PasswordField';

export default { title: 'Components/Forms/Fields' };

export const Password = () => (
  <Form onSubmit={action('onSubmit')}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <PF
          name="password"
          label={text('Label', 'Password')}
          placeholder={text('placeholder', 'Enter Password')}
          required={boolean('Required', true)}
          disabled={boolean('Disabled', false)}
          fullWidth={boolean('Full Width', true)}
          onClick={action('click')}
        />
      </form>
    )}
  </Form>
);
