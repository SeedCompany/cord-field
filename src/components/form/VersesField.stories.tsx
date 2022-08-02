import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import { Form } from 'react-final-form';
import { SubmitButton } from '.';
import { books } from '../../common/biblejs';
import { FieldSpy } from './FieldSpy';
import { VersesField } from './VersesField';

export default { title: 'Components/Forms/Fields/Verses' };

export const InitialValue = () => (
  <Form
    onSubmit={action('onSubmit')}
    initialValues={{
      verses: [
        {
          start: { book: 'Genesis', chapter: 1, verse: 3 },
          end: { book: 'Genesis', chapter: 2, verse: 5 },
        },
        {
          start: { book: 'Genesis', chapter: 4, verse: 2 },
          end: { book: 'Genesis', chapter: 5, verse: 5 },
        },
        {
          start: { book: 'Genesis', chapter: 6, verse: 4 },
          end: { book: 'Genesis', chapter: 8, verse: 9 },
        },
      ],
    }}
  >
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <VersesField
          name="verses"
          label={text('Label', 'Verses')}
          book={'Genesis'}
          fullWidth={boolean('Full Width', true)}
          disabled={boolean('Disabled', false)}
          required={boolean('Required', false)}
        />
        <SubmitButton />
        <FieldSpy name="verses" />
      </form>
    )}
  </Form>
);

export const Verses = () => (
  <Form onSubmit={action('onSubmit')}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <VersesField
          name="verses"
          label={text('Label', 'Verses')}
          book={select(
            'Book',
            books.map((b) => b.names[0]!),
            'Genesis'
          )}
          fullWidth={boolean('Full Width', true)}
          disabled={boolean('Disabled', false)}
          required={boolean('Required', true)}
        />
        <SubmitButton />
        <FieldSpy name="verses" />
      </form>
    )}
  </Form>
);
