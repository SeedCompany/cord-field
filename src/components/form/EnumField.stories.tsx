import { Box } from '@mui/material';
import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import { startCase } from 'lodash';
import { Form } from 'react-final-form';
import { Except } from 'type-fest';
import { csv } from '../../util';
import { EnumField, EnumFieldProps, EnumOption } from './EnumField';
import { FieldSpy } from './FieldSpy';

export default { title: 'Components/Forms/Fields/Enum' };

const colors = ['red', 'blue', 'green', 'yellow'];

export const Multiple = () => (
  <EnumStory
    multiple
    options={colors}
    getLabel={startCase}
    defaultOption={text('defaultOption', 'No Colors') || undefined}
  />
);

export const MultipleCustomChildren = () => (
  <EnumStory multiple>
    <EnumOption default label="All Colors" />
    {colors.map((color) => (
      <EnumOption key={color} label={startCase(color)} value={color} />
    ))}
    <EnumOption disabled value="teal" label="Teal" />
  </EnumStory>
);

export const Single = () => (
  <EnumStory
    options={colors}
    getLabel={startCase}
    defaultOption={text('defaultOption', 'No Colors') || undefined}
  />
);

export const SingleCustomChildren = () => (
  <EnumStory>
    <EnumOption default label="No Color" />
    {colors.map((color) => (
      <EnumOption key={color} label={startCase(color)} value={color} />
    ))}
    <EnumOption disabled value="teal" label="Teal" />
  </EnumStory>
);

const EnumStory = ({
  initialValue,
  ...props
}: Except<EnumFieldProps<any, any>, 'name'> & { initialValue?: any }) => {
  const name = props.multiple ? 'colors' : 'color';
  return (
    <Form
      onSubmit={action('submit')}
      initialValues={{
        [name]:
          initialValue ?? props.multiple
            ? csv(text('initialValue (csv)', 'blue, teal'))
            : text('initialValue', 'blue') || undefined,
      }}
    >
      {({ handleSubmit }) => (
        <>
          <Box component="form" onSubmit={handleSubmit} mb={4}>
            {/* @ts-expect-error TS doesn't like options or children being passed through */}
            <EnumField
              name={name}
              variant={select(
                'variant',
                [
                  'checkbox',
                  'radio',
                  'toggle-split',
                  'toggle-grouped',
                ] as const,
                'toggle-split'
              )}
              layout={select('layout', ['row', 'column', 'two-column'], 'row')}
              label={text('label', props.multiple ? 'Colors' : 'Color')}
              helperText={
                props.multiple ? 'Choose some colors' : 'Choose a color'
              }
              disabled={boolean('disabled', false)}
              required={boolean('required', false)}
              {...props}
            />
          </Box>
          <FieldSpy name={name} />
        </>
      )}
    </Form>
  );
};
