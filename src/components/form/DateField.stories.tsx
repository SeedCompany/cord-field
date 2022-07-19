import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { Form } from 'react-final-form';
import { date } from '../knobs.stories';
import { DateField } from './DateField';
import { FieldSpy } from './FieldSpy';

export default { title: 'Components/Forms/Fields' };

export const Date = () => (
  <Form onSubmit={action('onSubmit')}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <DateField
          name="startDate"
          label={text('Label', 'Start Date')}
          placeholder={text('placeholder', 'Enter Start Date')}
          disabled={boolean('Disabled', false)}
          fullWidth={boolean('Full Width', true)}
          helperText={text('HelperText', 'The MOU start date')}
          initialValue={date('initialValue')}
        />
        <FieldSpy name="startDate" />
      </form>
    )}
  </Form>
);
