import { Theme } from '@mui/material';

export const EditorJsTheme = (theme: Theme) => ({
  border: `thin solid ${theme.palette.divider}`,
  borderRadius: `${theme.shape.borderRadius}px`,
  minHeight: 200,
  overflow: 'auto',
  padding: 1,

  '& .codex-editor': {
    padding: 1,
  },
  '& .codex-editor__redactor': {
    paddingBottom: '0 !important',
  },
  '& .ce-settings': {
    left: '-68px',
  },

  '& .cdx-block': {
    padding: '0',
  },
  '& .ce-popover--opened': {
    maxHeight: '140px',
  },
  '& .codex-editor__loader': {
    height: '100%',
    '&::before': {
      marginTop: 4,
    },
  },

  // block styling
  '& .ce-paragraph': {
    fontSize: '0.875rem',
  },
});
