// import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
// import { FieldSpy } from './FieldSpy';
import { parseScriptureRange } from '../../util/biblejs/reference';
import { VerseField } from './VerseField';

export default { title: 'Components/Forms/Fields' };

const submit = ({ verse }: any) => {
  const res = parseScriptureRange('Ruth', verse);
  console.log(res);
};

export const Verse = () => (
  <Form
    onSubmit={
      submit
      // action('submit')
    }
  >
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <VerseField
          name="verse"
          label={text('Label', 'Verse')}
          placeholder={text('placeholder', 'Enter Verse')}
          // required={boolean('Required', true)}
          fullWidth={boolean('Full Width', true)}
          disabled={boolean('Disabled', false)}
        />
        {/* <FieldSpy name="verse" /> */}
      </form>
    )}
  </Form>
);
