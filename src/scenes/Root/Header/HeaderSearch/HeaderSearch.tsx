import { Search } from '@mui/icons-material';
import { Box, InputAdornment } from '@mui/material';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { StyleProps } from '~/common';
import { TextField } from '../../../../components/form';
import { makeQueryHandler, StringParam } from '../../../../hooks';

export const useSearch = makeQueryHandler({
  q: StringParam,
});

export const HeaderSearch = (props: StyleProps) => {
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
        <Box component="form" onSubmit={handleSubmit} {...props}>
          <TextField
            name="search"
            variant="outlined"
            placeholder="Search"
            size="small"
            helperText={false}
            InputProps={{
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
