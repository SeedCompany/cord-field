import { Search } from '@mui/icons-material';
import { Box, InputAdornment, useMediaQuery } from '@mui/material';
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

export const HeaderSearch = ({ sx }: StyleProps) => {
  const { classes } = useStyles();
  const [{ q: search = '' }] = useSearch();
  const navigate = useNavigate();

  const isMobile = useMediaQuery('(max-width: 600px)');

  return isMobile ? (
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
          sx={[
            ...extendSx(sx),
            {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              maxWidth: 500,
              mr: 0.5,
            },
          ]}
        >
          <Search sx={{ color: 'primary.contrastText' }} />
          <TextField
            name="search"
            variant="outlined"
            placeholder="Search..."
            size="small"
            sx={[
              {
                '& .MuiInputBase-root': {
                  color: 'primary.contrastText',
                  bgcolor: 'grey.600',
                  borderRadius: 0,
                  mb: -1,
                },
              },
            ]}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  disablePointerEvents
                ></InputAdornment>
              ),
            }}
          />
        </Box>
      )}
    </Form>
  ) : (
    <Form
      initialValues={{ search }}
      onSubmit={({ search }) => {
        if (search) {
          navigate(`/search?q=${search}`);
        }
      }}
    >
      {({ handleSubmit }) => (
        <Box component="form" onSubmit={handleSubmit} className={classes.root}>
          <TextField
            name="search"
            variant="outlined"
            placeholder="Projects, Languages, Locations, People, Partners"
            size="small"
            InputProps={{
              className: classes.input,
              startAdornment: (
                <InputAdornment position="start" disablePointerEvents>
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
    </Form>
  );
};
