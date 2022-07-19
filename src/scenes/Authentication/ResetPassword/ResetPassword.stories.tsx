import { action } from '@storybook/addon-actions';
import { ResetPasswordForm as Form } from './ResetPasswordForm';

export default { title: 'Scenes/Authentication/ResetPassword' };

export const ResetPasswordForm = () => <Form onSubmit={action('onSubmit')} />;
