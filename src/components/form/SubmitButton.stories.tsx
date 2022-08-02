import { Box } from '@material-ui/core';
import { boolean, select, text } from '@storybook/addon-knobs';
import { useSnackbar } from 'notistack';
import { Form } from 'react-final-form';
import { sleep } from '../../util';
import { SubmitButton as SB, SubmitAction } from './SubmitButton';

export default { title: 'Components/Forms/Submit Button' };

export const Styles = () => (
  <Form onSubmit={() => sleep(2000)}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <SB
          size={select('Size', ['small', 'medium', 'large'], 'large')}
          fullWidth={boolean('Full Width', true)}
          color={select(
            'Color',
            ['inherit', 'primary', 'secondary', 'default', 'error'],
            'error'
          )}
          variant={select(
            'Variant',
            ['contained', 'outlined', 'text'],
            'contained'
          )}
        >
          {text('Label', 'Submit')}
        </SB>
      </form>
    )}
  </Form>
);

export const MultipleActions = () => {
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Form<SubmitAction<'custom'>>
      onSubmit={async (data) => {
        await sleep(1000);
        enqueueSnackbar(`Submit Action: ${data.submitAction ?? 'default'}`);
      }}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <SB>Default Action</SB>
          <Box mt={2} />
          <SB action="custom">Custom Action</SB>
        </form>
      )}
    </Form>
  );
};
