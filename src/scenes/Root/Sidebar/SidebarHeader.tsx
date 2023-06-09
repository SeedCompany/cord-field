import { Box, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { CordIcon } from '../../../components/Icons';

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
  return (
    <Box
      sx={{
        display: 'flex',
        width: 1,
        height: 72,
        alignItems: 'center',
      }}
    >
      <CordIcon
        fontSize="large"
        sx={{
          borderRadius: '0',
          justifySelf: 'center',
          width: 60,
          height: 32,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          height: 1,
          pl: 2,
          flexDirection: 'column',
          alignItems: 'flex-start',
          backgroundColor: 'white',
          justifyContent: 'center',
          color: '#091016',
        }}
      >
        <Typography variant="h4" color="inherit">
          Cord Field
        </Typography>
        <Typography variant="caption" color="inherit">
          by Seed Company
        </Typography>
      </Box>
    </Box>

    // <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
    //   <CordIcon fontSize="large" sx={[...extendSx(sx)]} />
    //   <Box>
    //     <Typography variant="h4">Cord Field</Typography>
    //     <Typography variant="caption">by Seed Company</Typography>
    //   </Box>
    // </Box>
  );

  // return (
  //   <div className={classes.root}>
  //     <SwooshBackground />
  //     <div className={classes.floating}>
  //       <CordIcon sx={{ color: 'inherit', fontSize: 40 }} />
  //       <Typography
  //         className={classes.copyright}
  //         display="block"
  //         variant="caption"
  //       >
  //         © Seed Company
  //       </Typography>
  //     </div>
  //   </div>
  // );
};
