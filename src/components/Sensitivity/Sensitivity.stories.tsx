import { boolean, select } from '@storybook/addon-knobs';
import { Sensitivity as SensitivityComponent } from './Sensitivity';

export default { title: 'Components' };

export const Sensitivity = () => (
  <SensitivityComponent
    value={select('value', ['High', 'Medium', 'Low'], 'High')}
    loading={boolean('loading', false)}
  />
);
