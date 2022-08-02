import { select, text } from '@storybook/addon-knobs';
import { ButtonLink, ButtonLinkProps } from './ButtonLink';

export default {
  title: 'Components/Routing/ButtonLink',
};

export const Internal = () => <Story to="/">Homepage</Story>;

export const External = () => (
  <Story external to="https://google.com" target="_blank">
    Google
  </Story>
);

const Story = (defaults: ButtonLinkProps) => (
  <ButtonLink
    {...defaults}
    to={text('To', defaults.to as string)}
    target={text('Target', defaults.target || '')}
    color={select(
      'Color',
      ['inherit', 'primary', 'secondary', 'default'],
      'primary'
    )}
    variant={select('Variant', ['contained', 'text', 'outlined'], 'contained')}
    size={select('Size', ['small', 'medium', 'large'], 'medium')}
  >
    {text('Label', defaults.children ? `${defaults.children}` : '')}
  </ButtonLink>
);
