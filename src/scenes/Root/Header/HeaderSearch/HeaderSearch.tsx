import { Search } from '@mui/icons-material';
import { Box, InputAdornment, Theme } from '@mui/material';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { extendSx, StyleProps } from '~/common';
import { TextField } from '../../../../components/form';
import { makeQueryHandler, StringParam } from '../../../../hooks';

export const useSearch = makeQueryHandler({
  q: StringParam,
});

const useStyles = makeStyles()(({ palette, spacing }) => ({
  root: {
    flex: 1,
    maxWidth: 500,
    marginRight: spacing(3),
  },
  input: {
    background: palette.background.paper,
  },
}));

const containerSx = (theme: Theme) => ({
  [theme.breakpoints.up('xs')]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    maxWidth: 500,
    mr: 0.5,
    ml: 4,
  },
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    maxWidth: 500,
    mr: 3,
  },
});

const inputSx = (theme: Theme) => ({
  [theme.breakpoints.up('xs')]: {
    '& .MuiInputBase-root': {
      color: 'primary.contrastText',
      bgcolor: 'grey.600',
      borderRadius: 0,
      mb: -1,
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'grey.600',
      },
    },
  },
  [theme.breakpoints.up('sm')]: {
    '& .MuiInputBase-root': {
      color: 'text.primary',
      bgcolor: 'background.paper',
      borderRadius: 1,
      mb: 0,
    },
  },
});

const searchSx = { color: { xs: 'primary.contrastText', sm: 'initial' } };

export const HeaderSearch = ({ sx }: StyleProps) => {
  const { classes } = useStyles();
  const [{ q: search = '' }] = useSearch();
  const navigate = useNavigate();

  return (
    <Form
      initialValues={{ search }}
      onSubmit={({ search }) => {
        if (search) {
          navigate(`/search?q=${search}`);
        }
      }}
    >
      {({ handleSubmit }) => (
        <Box
          component="form"
          onSubmit={handleSubmit}
          className={classes.root}
          sx={[containerSx, ...extendSx(sx)]}
        >
          <TextField
            name="search"
            variant="outlined"
            placeholder="Projects, Languages, Locations, People, Partners"
            size="small"
            sx={inputSx}
            InputProps={{
              className: classes.input,
              startAdornment: (
                <InputAdornment position="start" disablePointerEvents>
                  <Search sx={searchSx} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
    </Form>
  );
};
