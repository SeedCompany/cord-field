import { Paper, PaperProps } from '@mui/material';
import { Box } from '@mui/system';
import { CreateLanguage as CreateLanguageType } from '~/api/schema.graphql';
import { CreateLanguage } from '../../../../scenes/Languages/Create';
import { LanguageFormValues } from '../../../../scenes/Languages/LanguageForm';
import { LookupField } from '../../index';
import {
  LanguageLookupItemFragment as Language,
  LanguageLookupDocument,
} from './LanguageLookup.graphql';

const columnWidths = { eth: 48, rolv: 72 };

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
      <Box sx={{ width: columnWidths.eth, textAlign: 'right' }}>ETH</Box>
      <Box sx={{ width: columnWidths.rolv, textAlign: 'right', ml: 1 }}>
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
              width: columnWidths.eth,
              textAlign: 'right',
              color: 'text.secondary',
              typography: 'body2',
            }}
          >
            {option.ethnologue.code.value}
          </Box>
          <Box
            sx={{
              width: columnWidths.rolv,
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
