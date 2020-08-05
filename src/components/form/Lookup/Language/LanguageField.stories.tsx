import { action } from '@storybook/addon-actions';
import React, { FC } from 'react';
import { Form } from 'react-final-form';
import { FieldSpy } from '../../FieldSpy';
import { LanguageField } from './LanguageField';

export default { title: 'Components/Forms/Fields/Lookup/Language' };

const FF: FC = ({ children }) => (
  <Form
    onSubmit={action('submit')}
    initialValues={{
      language: {
        id: 'languageid',
        name: {
          value: 'Borana',
        },
      },
      languages: [
        {
          id: 'languageid',
          name: {
            value: 'Borana',
          },
        },
      ],
    }}
  >
    {({ handleSubmit }) => <form onSubmit={handleSubmit}>{children}</form>}
  </Form>
);

export const Single = () => (
  <FF>
    <LanguageField name="language" label="Lang" required />
    <FieldSpy name="language" />
  </FF>
);

export const Multiple = () => (
  <FF>
    <LanguageField name="languages" multiple label="Langs" />
    <FieldSpy name="languages" />
  </FF>
);
