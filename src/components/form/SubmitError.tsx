import { Alert, AlertProps, Collapse } from '@mui/material';
import { styled } from '@mui/material/styles';
import Markdown from 'markdown-to-jsx';
import { memo } from 'react';
import { useFormState } from 'react-final-form';
import { extendSx } from '~/common';

/**
 * Standard styling for displaying form submission errors.
 * If no children are passed, the component displays the form's submitErrors
 * if it is a string.
 */
export const SubmitError = ({ children, ...rest }: AlertProps) => {
  const { submitError } = useFormState({
    subscription: {
      submitError: true,
    },
  });
  const error = children || submitError;
  return (
    <Collapse in={!!error}>
      <Alert severity="error" {...rest} sx={[{ mb: 2 }, ...extendSx(rest.sx)]}>
        {children ||
          (typeof submitError === 'string' ? (
            <MarkdownStyled>{submitError}</MarkdownStyled>
          ) : (
            submitError
          ))}
      </Alert>
    </Collapse>
  );
};

const MarkdownStyled = memo(function MarkdownStyled({
  children,
}: {
  children: string;
}) {
  return <Markdown options={{ wrapper: MkdownRoot }}>{children}</Markdown>;
});

const MkdownRoot = styled('div')(({ theme }) => ({
  '> :first-child': {
    marginBlockStart: 0,
  },
  '> :last-child': {
    marginBlockEnd: 0,
  },
  'p, ul': {
    marginBlock: theme.spacing(1),
  },
  ul: {
    paddingInlineStart: theme.spacing(4),
  },
}));
