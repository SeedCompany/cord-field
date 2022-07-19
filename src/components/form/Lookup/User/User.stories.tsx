import { action } from '@storybook/addon-actions';
import { Form } from 'react-final-form';
import { ChildrenProp } from '~/common';
import { FieldSpy } from '../../FieldSpy';
import { UserField as UF } from './UserField';

export default { title: 'Components/Forms/Fields/Lookup/User' };

const FF = ({ children }: ChildrenProp) => (
  <Form
    onSubmit={action('submit')}
    initialValues={{
      user: {
        id: 'userid',
        fullName: 'Bob Smith',
      },
      users: [
        { id: 'userid1', fullName: 'Bob Smith' },
        { id: 'user2', fullName: 'Jill McGregor' },
        { id: 'user3', fullName: 'John Russ' },
      ],
    }}
  >
    {({ handleSubmit }) => <form onSubmit={handleSubmit}>{children}</form>}
  </Form>
);

export const Single = () => (
  <FF>
    <UF name="user" label="User" required />
    <FieldSpy name="user" />
  </FF>
);

export const Multiple = () => (
  <FF>
    <UF name="users" multiple label="Users" />
    <FieldSpy name="users" />
  </FF>
);
