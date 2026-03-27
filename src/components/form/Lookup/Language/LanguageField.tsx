import { Box, Paper, PaperProps } from '@mui/material';
import { CreateLanguage as CreateLanguageType } from '~/api/schema.graphql';
import { CreateLanguage } from '../../../../scenes/Languages/Create';
import { LanguageFormValues } from '../../../../scenes/Languages/LanguageForm';
import { LookupField } from '../../index';
import {
  LanguageLookupItemFragment as Language,
  LanguageLookupDocument,
} from './LanguageLookup.graphql';

const ETH_COLUMN_WIDTH = 48; // includes right padding
const ROLV_COLUMN_WIDTH = 72; // includes right padding

const LanguageDropdownPaper = (props: PaperProps) => (
  <Paper {...props} sx={{ ...props.sx, minWidth: 480 }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 0.5,
        borderBottom: 1,
        borderColor: 'divider',
        typography: 'caption',
        color: 'text.secondary',
        userSelect: 'none',
      }}
    >
      <Box sx={{ flex: 1 }}>Language</Box>
      <Box sx={{ width: ETH_COLUMN_WIDTH, textAlign: 'right' }}>ETH</Box>
      <Box sx={{ width: ROLV_COLUMN_WIDTH, textAlign: 'right', ml: 1 }}>
        ROLV
      </Box>
    </Box>
    {props.children}
  </Paper>
);

export const LanguageField = LookupField.createFor<
  Language,
  LanguageFormValues<CreateLanguageType>
>({
  resource: 'Language',
  lookupDocument: LanguageLookupDocument,
  label: 'Language',
  placeholder: 'Search for a language by name',
  getOptionLabel: (option) => option.name.value ?? option.displayName.value,
  CreateDialogForm: CreateLanguage,
  getInitialValues: (name) => ({ name, displayName: name }),
  PaperComponent: LanguageDropdownPaper,
  renderOption: (props, option) => (
    <li {...props}>
      {typeof option === 'string' ? (
        `Create "${option}"`
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {option.name.value ?? option.displayName.value}
          </Box>
          <Box
            sx={{
              width: ETH_COLUMN_WIDTH,
              textAlign: 'right',
              color: 'text.secondary',
              typography: 'body2',
            }}
          >
            {option.ethnologue.code.value}
          </Box>
          <Box
            sx={{
              width: ROLV_COLUMN_WIDTH,
              textAlign: 'right',
              ml: 1,
              color: 'text.secondary',
              typography: 'body2',
            }}
          >
            {option.registryOfLanguageVarietiesCode.value}
          </Box>
        </Box>
      )}
    </li>
  ),
});
