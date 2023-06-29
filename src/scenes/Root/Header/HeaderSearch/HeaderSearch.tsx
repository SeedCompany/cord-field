import { Search } from '@mui/icons-material';
import { Box, InputAdornment } from '@mui/material';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { extendSx, StyleProps } from '~/common';
import { TextField } from '../../../../components/form';
import { makeQueryHandler, StringParam } from '../../../../hooks';

export const useSearch = makeQueryHandler({
  q: StringParam,
});

const formSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: 1,
  height: 1,
  m: { sm: 1 },
  mr: { xs: 4 },
  ml: { xs: 5, sm: 3 },
  maxWidth: { mobile: 500 },
};

const inputSx = {
  my: { xs: 0 },
  mt: { sm: 1 },
  display: { xs: 'flex', sm: 'inline-flex' },
  alignItems: { xs: 'center' },

  '& .MuiInputBase-root': {
    color: { xs: '#091016', sm: 'text.primary' },
    bgcolor: 'white',
    borderRadius: 1,
    border: '1px solid',
    borderColor: { xs: '#D1DADF', sm: 'primary.main' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: { xs: 'grey.100', sm: 'primary.main' },
    },
  },
  '& .MuiFormHelperText-root': {
    display: { xs: 'none', sm: 'block' },
  },
};

const searchSx = { color: { xs: '#091016', sm: 'black' } };

export const HeaderSearch = ({ sx }: StyleProps) => {
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
          sx={[formSx, ...extendSx(sx)]}
        >
          <TextField
            name="search"
            variant="outlined"
            placeholder="Search"
            size="small"
            sx={inputSx}
            InputProps={{
              endAdornment: (
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
