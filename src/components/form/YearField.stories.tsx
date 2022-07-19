import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { Form } from 'react-final-form';
import { FieldSpy } from './FieldSpy';
import { YearField } from './YearField';

export default { title: 'Components/Forms/Fields' };

export const Year = () => (
  <Form onSubmit={action('submit')}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <YearField
          name="year"
          label={text('Label', 'Year')}
          autoComplete="off"
          placeholder={text('placeholder', 'Enter Year')}
          required={boolean('Required', true)}
          fullWidth={boolean('Full Width', true)}
          disabled={boolean('Disabled', false)}
        />
        <FieldSpy name="year" />
      </form>
    )}
  </Form>
);
