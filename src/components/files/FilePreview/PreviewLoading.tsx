import { CircularProgress, Grid } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: 200,
  },
}));

export const PreviewLoading = () => {
  const { classes } = useStyles();
  return (
    <Grid item>
      <div className={classes.container}>
        <CircularProgress size={60} />
      </div>
    </Grid>
  );
};
