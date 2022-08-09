import { Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { CordIcon } from '../../../components/Icons';
import { SwooshBackground } from './SwooshBackground';

const useStyles = makeStyles()(({ spacing, typography }) => ({
  root: {
    position: 'relative',
  },
  floating: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '15%',
    padding: spacing(0, 4, 0, 4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  copyright: {
    fontWeight: typography.fontWeightLight,
  },
}));

export const SidebarHeader = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <SwooshBackground />
      <div className={classes.floating}>
        <CordIcon sx={{ color: 'inherit', fontSize: 40 }} />
        <Typography
          className={classes.copyright}
          display="block"
          variant="caption"
        >
          © Seed Company
        </Typography>
      </div>
    </div>
  );
};
