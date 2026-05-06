import { Search } from '@mui/icons-material';
import { Box, IconButton, InputAdornment } from '@mui/material';
import { useEffect, useRef } from 'react';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { extendSx, StyleProps } from '~/common';
import { TextField } from '~/components/form';
import { makeQueryHandler, StringParam } from '~/hooks';

export const useSearch = makeQueryHandler({
  q: StringParam,
});

export interface HeaderSearchProps extends StyleProps {
  expanded: boolean;
  onExpandedChange: (value: boolean) => void;
}

export const HeaderSearch = ({
  sx,
  className,
  expanded,
  onExpandedChange,
}: HeaderSearchProps) => {
  const [{ q: search = '' }] = useSearch();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded) {
      inputRef.current?.focus();
    }
  }, [expanded]);

  return (
    <Box
      sx={[{ display: 'flex', alignItems: 'center' }, ...extendSx(sx)]}
      className={className}
    >
      {/* Collapsed icon — xs only, hidden once expanded or on mobile+ */}
      <IconButton
        sx={{
          display: {
            xs: expanded ? 'none' : 'inline-flex',
            mobile: 'none',
          },
        }}
        onClick={() => onExpandedChange(true)}
        color="inherit"
        aria-label="Open search"
      >
        <Search />
      </IconButton>

      <Form
        initialValues={{ search }}
        onSubmit={({ search: q }) => {
          if (q) navigate(`/search?q=${q}`);
        }}
      >
        {({ handleSubmit }) => (
          <Box
            component="form"
            onSubmit={handleSubmit}
            onBlur={() => onExpandedChange(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onExpandedChange(false);
            }}
            sx={{
              display: {
                xs: expanded ? 'flex' : 'none',
                mobile: 'flex',
              },
              width: '100%',
            }}
          >
            <TextField
              name="search"
              variant="outlined"
              placeholder="Search"
              size="small"
              helperText={false}
              InputProps={{
                inputRef,
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
    </Box>
  );
};
