import { Theme } from '@mui/material';

export const EditorJsTheme = (theme: Theme) => ({
  zIndex: 2, // keep toolbars above other fields' input labels.

  '.MuiInputBase-input': {
    height: 'initial', // Full width, we'll set the size in wrapper
    display: 'flex',
    flexDirection: 'column',
  },
  '.codex-editor': {
    flex: 1,
  },
  '.ce-block__content': {
    // Full width, we'll set the size in wrapper
    maxWidth: 'initial',
  },

  // center loader vertically
  '.codex-editor__loader': {
    height: '100%',
    position: 'unset',

    // Loader is primary color
    '&::before': {
      borderColor: theme.palette.primary.main,
      borderTopColor: 'transparent',
    },
  },

  // Right align toolbar buttons
  '.ce-toolbar': {
    left: 'unset',
    '&__content': {
      maxWidth: 'initial',
    },
  },
  // Anchor tools popup from the right
  '.ce-toolbox': {
    display: 'flex',
    justifyContent: 'flex-end',
    left: '100%',
  },
  // Anchor settings popup from the right
  '.ce-settings': {
    left: '-100%',
  },

  // Change placeholder to match InputBase
  '.ce-paragraph[data-placeholder]:empty::before': {
    color: 'currentColor',
  },
  '.codex-editor--empty .ce-block:first-of-type .ce-paragraph[data-placeholder]:empty::before':
    {
      opacity: theme.palette.mode === 'dark' ? 0.5 : 0.42,
    },

  '.ce-block:first-of-type .ce-paragraph': {
    // Matches TextField better
    paddingTop: 0,
  },
});
