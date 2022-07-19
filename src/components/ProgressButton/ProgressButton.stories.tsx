import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import { ProgressButton as PB } from './ProgressButton';

export default { title: 'Components/Buttons' };

export const ProgressButton = () => (
  <PB
    color={select(
      'Color',
      ['inherit', 'primary', 'secondary', 'default', 'error'],
      'primary'
    )}
    variant={select('Variant', ['contained', 'text', 'outlined'], 'contained')}
    size={select('Size', ['small', 'medium', 'large'], 'medium')}
    disabled={boolean('Disabled', false)}
    progress={boolean('In progress', false)}
    fullWidth={boolean('Full Width', false)}
    onClick={action('click')}
  >
    {text('Label', `Click Me!`)}
  </PB>
);
