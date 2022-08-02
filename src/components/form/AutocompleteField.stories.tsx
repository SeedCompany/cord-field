import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { startCase } from 'lodash';
import { Form } from 'react-final-form';
import { csv } from '../../util';
import { AutocompleteField } from './AutocompleteField';
import { FieldSpy } from './FieldSpy';
import { SubmitButton } from './SubmitButton';

export default {
  title: 'Components/Forms/Fields/Autocomplete',
};

export const SelectSingle = () => {
  const disabled = boolean('Disabled', false);
  const initialValue = text('initialValue', '');

  return (
    <Form
      onSubmit={action('submit')}
      initialValues={{ color: initialValue || undefined }}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <AutocompleteField
            options={['red', 'blue', 'green']}
            getOptionLabel={startCase}
            name="color"
            label={text('Label', 'Color')}
            disabled={disabled}
            required={boolean('Required', false)}
            helperText={text('Helper Text', 'Choose carefully')}
          />
          <FieldSpy name="color" />
          <SubmitButton />
        </form>
      )}
    </Form>
  );
};

export const SelectMultiple = () => {
  const disabled = boolean('Disabled', false);
  const initialValue = csv(text('initialValues', ''));

  return (
    <Form onSubmit={action('submit')} initialValues={{ color: initialValue }}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <AutocompleteField
            multiple
            variant="outlined"
            ChipProps={{ variant: 'default' }}
            options={['red', 'blue', 'green']}
            getOptionLabel={startCase}
            name="color"
            label={text('Label', 'Color')}
            disabled={disabled}
            required={boolean('Required', false)}
            helperText={text('Helper Text', 'Choose carefully')}
          />
          <FieldSpy name="color" />
          <SubmitButton />
        </form>
      )}
    </Form>
  );
};
