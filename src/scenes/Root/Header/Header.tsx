import { AppBar } from '@mui/material/';
import { makeStyles } from 'tss-react/mui';
import { HeaderSearch } from './HeaderSearch';
import { ProfileToolbar } from './ProfileToolbar';

const useStyles = makeStyles()(({ spacing }) => ({
  root: {
    padding: spacing(2, 1, 0, 1),
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    background: 'white',
  },
}));

export const Header = () => {
  const { classes } = useStyles();

  return (
    <AppBar className={classes.root}>
      <HeaderSearch />
      <ProfileToolbar />
    </AppBar>
  );
};
