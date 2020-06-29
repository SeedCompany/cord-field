import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
import {
  formatScriptureRange,
  parseScriptureRange,
  scriptureToVerseRange,
  validateScriptureRange,
  verseToScriptureRange,
} from '../../util/biblejs/reference';
import { FieldSpy } from './FieldSpy';
import { VerseField } from './VerseField';

export default { title: 'Components/Forms/Fields' };

const submit = ({ verse }: any) => {
  const res = parseScriptureRange('Revelation', verse);
  if (!res) return;
  const verified = validateScriptureRange(res);
  const verseRange = scriptureToVerseRange(verified);

  const scriptureRange = verseToScriptureRange(verseRange);

  const formattedString = formatScriptureRange(scriptureRange);
};

export const Verse = () => (
  <Form onSubmit={submit}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <VerseField
          name="verse"
          label={text('Label', 'Verse')}
          placeholder={text('placeholder', 'Enter Verse')}
          fullWidth={boolean('Full Width', true)}
          disabled={boolean('Disabled', false)}
        />
        <FieldSpy name="verse" />
      </form>
    )}
  </Form>
);
