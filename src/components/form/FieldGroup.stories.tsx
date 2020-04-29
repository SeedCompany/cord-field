import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
import { FieldGroup as FG } from './FieldGroup';

export default { title: 'Components/FieldGroup' };

export const FieldGroup = () => (
  <Form onSubmit={action('onSubmit')}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <FG prefix="Prefix" children={text('Children', 'FieldGroup')} />
      </form>
    )}
  </Form>
);
