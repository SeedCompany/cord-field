import { ReactNode } from 'react';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 400,
    margin: spacing(4, 1),
  },
}));

interface AuthContentProps {
  className?: string;
  children?: ReactNode;
}

export const AuthContent = ({ className, children }: AuthContentProps) => {
  const { classes, cx } = useStyles();
  return <div className={cx(classes.root, className)}>{children}</div>;
};
