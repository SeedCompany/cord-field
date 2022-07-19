import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import { Form } from 'react-final-form';
import { SwitchField } from './SwitchField';

export default { title: 'Components/Forms/Fields' };

export const Switch = () => (
  <Form onSubmit={action('onSubmit')}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <SwitchField
          name="notifications"
          label={text('Label', 'Notifications')}
          labelPlacement={select(
            'Label Placement',
            ['start', 'end', 'top', 'bottom'],
            'end'
          )}
          defaultValue={boolean('Default Value', true)}
          disabled={boolean('Disabled', false)}
          color={select(
            'Color',
            ['primary', 'secondary', 'default'],
            'secondary'
          )}
          helperText={text('Helper Text', 'Just so you know...')}
        />
      </form>
    )}
  </Form>
);
