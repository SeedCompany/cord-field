import { InputAdornment, makeStyles } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { FC } from 'react';
import * as React from 'react';
import { Form } from 'react-final-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField } from '../../../../components/form';
import { makeQueryHandler, StringParam } from '../../../../hooks';

export const useSearch = makeQueryHandler({
  q: StringParam,
});

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    flex: 1,
    maxWidth: 500,
    marginRight: spacing(3),
  },
  input: {
    background: palette.background.paper,
  },
}));

export const HeaderSearch: FC = () => {
  const classes = useStyles();
  const [{ q: search = '' }] = useSearch();
  const { pathname, search: routeSearch } = useLocation();
  const currentSearch = routeSearch.split('?q=')[1];
  const navigate = useNavigate();

  return (
    <Form
      initialValues={{ search }}
      onSubmit={({ search }) => {
        if (search) {
          // cover cases where the user searches for the exact same thing again
          if (pathname === '/search' && search === currentSearch) {
            navigate(0);
          } else {
            navigate(`/search?q=${search}`);
          }
        }
      }}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className={classes.root}>
          <TextField
            name="search"
            variant="outlined"
            placeholder="Projects, Languages, Locations, People"
            size="small"
            InputProps={{
              className: classes.input,
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </form>
      )}
    </Form>
  );
};
