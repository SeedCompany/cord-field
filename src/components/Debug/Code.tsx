import { makeStyles } from '@mui/material';
import clsx from 'clsx';
import { ChildrenProp } from '~/common';

const useStyles = makeStyles((theme) => ({
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
  const classes = useStyles();
  return (
    <pre className={clsx(classes.root, className)}>
      {json ? JSON.stringify(json, undefined, 2) : children}
    </pre>
  );
};
