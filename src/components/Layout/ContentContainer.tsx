import { makeStyles } from 'tss-react/mui';
import { ChildrenProp } from '~/common';

const useStyles = makeStyles()(({ spacing }) => ({
  root: {
    flex: 1,
    overflow: 'hidden',
    padding: spacing(4, 0, 0, 4),
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const ContentContainer = (
  props: { className?: string } & ChildrenProp
) => {
  const { classes, cx } = useStyles();
  return (
    <div className={cx(classes.root, props.className)}>{props.children}</div>
  );
};
