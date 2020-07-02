import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
// import {
//   formatScriptureRange,
//   parseScriptureRange,
//   scriptureToVerseRange,
//   validateScriptureRange,
//   verseToScriptureRange,
// } from '../../util/biblejs/reference';
import { FieldSpy } from './FieldSpy';
import { VersesField } from './VersesField';

export default { title: 'Components/Forms/Fields' };

const submit = (params: any) => {
  // console.log(params);
  // const res = parseScriptureRange('Revelation', verses);
  // if (!res) return;
  // const verified = validateScriptureRange(res);
  // const verseRange = scriptureToVerseRange(verified);
  // const scriptureRange = verseToScriptureRange(verseRange);
  // const formattedString = formatScriptureRange(scriptureRange);
};

export const Verses = () => (
  <Form onSubmit={submit}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <VersesField
          name="verses"
          label={text('Label', 'Verses')}
          placeholder={text('placeholder', 'Enter Verses')}
          fullWidth={boolean('Full Width', true)}
          disabled={boolean('Disabled', false)}
          book="Exodus"
        />
        <FieldSpy name="verses" />
      </form>
    )}
  </Form>
);
