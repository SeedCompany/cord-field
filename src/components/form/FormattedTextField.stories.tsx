import { action } from '@storybook/addon-actions';
import React from 'react';
import { Form } from 'react-final-form';
import { FormattedTextField } from './FormattedTextField';

export default { title: 'Components/Forms/Fields' };

export const FormattedText = () => (
  <Form onSubmit={action('onSubmit')}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <FormattedTextField
          name="float"
          label="Mandatory dot"
          helperText="Mandatory dot (even if user enters comma) as floating point"
          accept={/[\d.,]+/g}
          // allow only one floating point
          formatInput={(v) => (/\d+[.,]?\d*/.exec(v) ?? []).join('')}
          replace={(v) => v.replace(',', '.')}
        />
        <FormattedTextField
          name="lowercase"
          label="Lower case"
          replace={(v) => v.toLowerCase()}
        />
        <FormattedTextField
          name="uppercase"
          label="Upper case"
          replace={(v) => v.toUpperCase()}
        />
        <FormattedTextField
          name="latin"
          label="latin letters"
          helperText="Allow latin letters only"
          accept={/[a-zA-Z]/g}
          formatInput={(v) => (v.match(/[a-zA-Z]/g) ?? []).join('')}
        />
        <FormattedTextField
          name="comment"
          label="comment"
          helperText="Leave a comment about Rifm"
          replace={(v) =>
            'Rifm is the best mask and formatting library. I love it! '
              .repeat(20)
              .slice(0, v.length)
          }
        />
      </form>
    )}
  </Form>
);
