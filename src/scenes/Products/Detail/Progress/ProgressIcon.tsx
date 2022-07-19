import { makeStyles } from '@material-ui/core';
import { CheckCircle } from '@material-ui/icons';

const useStyles = makeStyles(({ spacing, palette }) => ({
  done: {
    // Scale icon to same size as rest
    transform: 'scale(1.2)',
  },
  notDone: {
    width: spacing(3),
    height: spacing(3),
    backgroundColor: palette.action.disabledBackground,
    borderRadius: '100%',
  },
}));

export const ProgressIcon = ({ complete }: { complete: boolean }) => {
  const classes = useStyles();

  return complete ? (
    <CheckCircle color="primary" className={classes.done} />
  ) : (
    <div className={classes.notDone} />
  );
};
