import { Typography as TP, TypographyVariant } from '@material-ui/core';
import { boolean, select } from '@storybook/addon-knobs';

export default { title: 'Components' };

const VariantOptions: TypographyVariant[] = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'body1',
  'body2',
  'subtitle1',
  'subtitle2',
  'caption',
  'button',
  'overline',
];

const VariantValues = [
  'Heading.',
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur.',
] as const;

export const Typography = () => (
  <div>
    {VariantOptions.map((name, index) => {
      return (
        <TP
          key={index}
          variant={name}
          color={select(
            'Color',
            [
              'inherit',
              'initial',
              'primary',
              'secondary',
              'textPrimary',
              'textSecondary',
              'error',
            ],
            'initial'
          )}
          align={select(
            'Align',
            ['left', 'right', 'center', 'justify', 'inherit'],
            'left'
          )}
          display={select('Display', ['initial', 'inline', 'block'], 'block')}
          gutterBottom={boolean('gutterBottom', true)}
          paragraph={boolean('paragraph', false)}
        >
          {index < 6
            ? name + '- ' + VariantValues[0]
            : index < 10
            ? name + '- ' + VariantValues[1]
            : name + ' TEXT'}
        </TP>
      );
    })}
  </div>
);
