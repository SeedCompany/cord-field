import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { Form } from 'react-final-form';
import { ChildrenProp } from '~/common';
import { FieldSpy } from '../../FieldSpy';
import { FilmField } from './FilmField';

export default { title: 'Components/Forms/Fields/Lookup' };

const FF = ({ children }: ChildrenProp) => (
  <Form onSubmit={action('submit')}>
    {({ handleSubmit }) => <form onSubmit={handleSubmit}>{children}</form>}
  </Form>
);

export const Film = () => (
  <FF>
    <FilmField name="film" label="Film" multiple={boolean('Multiple', false)} />
    <FieldSpy name="film" />
  </FF>
);
