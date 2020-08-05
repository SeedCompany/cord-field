import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import React, { FC } from 'react';
import { Form } from 'react-final-form';
import { FieldSpy } from '../../FieldSpy';
import {
  FilmField,
  LiteracyMaterialField,
  SongField,
  StoryField,
} from './ProductFields';

export default { title: 'Components/Forms/Fields/Lookup/Product' };

const FF: FC = ({ children }) => (
  <Form
    onSubmit={action('submit')}
    initialValues={{
      film: {
        id: 'filmid',
        name: {
          value: 'Jesus Film',
        },
      },
      story: {
        id: 'storyid',
        name: {
          value: 'The Beginning',
        },
      },
      literacyMaterial: {
        id: 'literacymaterialid',
        name: {
          value: 'Literacy Materials 1',
        },
      },
      song: {
        id: 'songid',
        name: {
          value: 'Song Title',
        },
      },
    }}
  >
    {({ handleSubmit }) => <form onSubmit={handleSubmit}>{children}</form>}
  </Form>
);

export const Film = () => (
  <FF>
    <FilmField name="film" label="Film" multiple={boolean('Multiple', false)} />
    <FieldSpy name="film" />
  </FF>
);

export const Story = () => (
  <FF>
    <StoryField
      name="story"
      label="story"
      multiple={boolean('Multiple', false)}
    />
    <FieldSpy name="story" />
  </FF>
);

export const LiteracyMaterial = () => (
  <FF>
    <LiteracyMaterialField
      name="literacyMaterial"
      label="Literacy Material"
      multiple={boolean('Multiple', false)}
    />
    <FieldSpy name="literacyMaterial" />
  </FF>
);

export const Song = () => (
  <FF>
    <SongField name="song" label="Song" multiple={boolean('Multiple', false)} />
    <FieldSpy name="song" />
  </FF>
);
