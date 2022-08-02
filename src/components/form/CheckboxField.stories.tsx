import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import { Form } from 'react-final-form';
import { CheckboxField as CB } from './CheckboxField';

export default { title: 'Components/Forms/Fields' };

export const Checkbox = () => (
  <Form onSubmit={action('onSubmit')}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <CB
          name="checkbox"
          label={text('Label', 'Checkbox')}
          labelPlacement={select(
            'Label Placement',
            ['start', 'end', 'top', 'bottom'],
            'end'
          )}
          defaultValue={boolean('DefaultValue', true)}
          disabled={boolean('Disabled', false)}
          color={select(
            'Color',
            ['primary', 'secondary', 'default'],
            'secondary'
          )}
          onClick={action('click')}
        />
      </form>
    )}
  </Form>
);
