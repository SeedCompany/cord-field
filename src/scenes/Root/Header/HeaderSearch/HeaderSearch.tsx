import { Search } from '@mui/icons-material';
import { Box, InputAdornment } from '@mui/material';
import { useState } from 'react';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { StyleProps, useIsMobile } from '~/common';
import { IconButton } from '~/components/IconButton';
import { TextField } from '../../../../components/form';
import { makeQueryHandler, StringParam } from '../../../../hooks';

export const useSearch = makeQueryHandler({
  q: StringParam,
});

export const HeaderSearch = (props: StyleProps) => {
  const [{ q: search = '' }] = useSearch();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  // On mobile the field is collapsed to an icon to free up the cramped toolbar;
  // tapping it expands the full search field.
  const [expanded, setExpanded] = useState(false);

  if (isMobile && !expanded) {
    return (
      <IconButton
        aria-label="Search"
        edge="start"
        onClick={() => setExpanded(true)}
      >
        <Search />
      </IconButton>
    );
  }

  return (
    <Form
      initialValues={{ search }}
      onSubmit={({ search }) => {
        if (search) {
          navigate(`/search?q=${search}`);
        }
        // Collapse the mobile search back to its icon after submitting.
        setExpanded(false);
      }}
    >
      {({ handleSubmit }) => (
        <Box
          component="form"
          onSubmit={handleSubmit}
          // Collapse back to the icon when focus leaves the mobile search.
          onBlur={() => isMobile && setExpanded(false)}
          {...props}
        >
          <TextField
            name="search"
            variant="outlined"
            placeholder="Search"
            size="small"
            helperText={false}
            autoFocus={isMobile}
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
