import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { Form } from 'react-final-form';
import { EmailField } from './EmailField';
import { FieldSpy } from './FieldSpy';

export default { title: 'Components/Forms/Fields' };

export const Email = () => (
  <Form onSubmit={action('submit')}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <EmailField
          name="email"
          label={text('Label', 'Email')}
          placeholder={text('placeholder', 'Enter Email Address')}
          required={boolean('Required', true)}
          fullWidth={boolean('Full Width', true)}
          disabled={boolean('Disabled', false)}
        />
        <FieldSpy name="email" />
      </form>
    )}
  </Form>
);
