import { InputAdornment, makeStyles } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import * as React from 'react';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
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

export const HeaderSearch = () => {
  const classes = useStyles();
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
        <form onSubmit={handleSubmit} className={classes.root}>
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
        </form>
      )}
    </Form>
  );
};
