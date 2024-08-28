import { styled } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';
import { ChildrenProp } from '~/common';

const useStyles = makeStyles()((theme) => ({
  root: {
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.background.paper,
    backgroundColor: theme.palette.grey[800],
  },
}));

export const Code = ({
  className,
  json,
  children,
}: { json?: any; className?: string } & ChildrenProp) => {
  const { classes, cx } = useStyles();
  return (
    <pre className={cx(classes.root, className)}>
      {json ? JSON.stringify(json, undefined, 2) : children}
    </pre>
  );
};

export const InlineCode = styled('code')(({ theme }) => ({
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[300],
}));
