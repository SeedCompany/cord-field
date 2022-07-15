import { Skeleton } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(({ shape }) => ({
  loading: {
    width: '100%',
    height: 200,
    borderRadius: shape.borderRadius,
  },
}));

export const TableLoading = () => {
  const { classes } = useStyles();
  return <Skeleton variant="rectangular" className={classes.loading} />;
};
