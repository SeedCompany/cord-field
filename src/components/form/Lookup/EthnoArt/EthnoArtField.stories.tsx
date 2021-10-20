import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import React, { FC } from 'react';
import { Form } from 'react-final-form';
import { FieldSpy } from '../../FieldSpy';
import { EthnoArtField } from './EthnoArtField';

export default { title: 'Components/Forms/Fields/Lookup' };

const FF: FC = ({ children }) => (
  <Form onSubmit={action('submit')}>
    {({ handleSubmit }) => <form onSubmit={handleSubmit}>{children}</form>}
  </Form>
);

export const EthnoArt = () => (
  <FF>
    <EthnoArtField
      name="ethnoArt"
      label="EthnoArt"
      multiple={boolean('Multiple', false)}
    />
    <FieldSpy name="ethnoArt" />
  </FF>
);
