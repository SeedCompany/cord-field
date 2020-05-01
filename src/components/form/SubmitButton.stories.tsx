import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
import { sleep } from '../../util';
import { SubmitButton as SB } from './SubmitButton';

export default { title: 'Components/Forms' };

export const SubmitButton = () => (
  <Form onSubmit={() => sleep(2000)}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <SB
          size={select('Size', ['small', 'medium', 'large'], 'large')}
          fullWidth={boolean('Full Width', true)}
          color={select(
            'Color',
            ['inherit', 'primary', 'secondary', 'default', 'error'],
            'error'
          )}
          variant={select(
            'Variant',
            ['contained', 'outlined', 'text'],
            'contained'
          )}
        >
          {text('Label', 'Submit')}
        </SB>
      </form>
    )}
  </Form>
);
