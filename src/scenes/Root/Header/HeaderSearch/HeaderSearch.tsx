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
  m: { sm: 0 },
  mr: { xs: 0, mobile: 3 },
  ml: { xs: 4 },
  maxWidth: { mobile: 500 },
};

const inputSx = {
  my: { xs: 0 },
  mt: { sm: 1 },
  display: { xs: 'flex', sm: 'inline-flex' },
  alignItems: { xs: 'center' },

  '& .MuiInputBase-root': {
    color: { xs: 'primary.contrastText', sm: 'text.primary' },
    bgcolor: { xs: 'grey.600', sm: 'background.paper' },
    borderRadius: { xs: 0, sm: 1 },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: { xs: 'grey.100', sm: 'primary.main' },
    },
  },
  '& .MuiFormHelperText-root': {
    display: { xs: 'none', sm: 'block' },
  },
};

const searchSx = { color: { xs: 'primary.contrastText', sm: 'inherit' } };

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
            placeholder="Projects, Languages, Locations, People, Partners"
            size="small"
            sx={inputSx}
            InputProps={{
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
