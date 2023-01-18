import { Theme } from '@mui/material';
import { mapFromList } from '../../common';

export const EditorJsTheme = (theme: Theme) => ({
  zIndex: 2, // keep toolbars above other fields' input labels.

  // Fix editor showing toolbar when not focused
  '.MuiInputBase-root:not(.Mui-focused) .ce-toolbar--opened': {
    display: 'none',
  },

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

  // Sync Header block to theme
  ...mapFromList([1, 2, 3, 4, 5, 6] as const, (level) => {
    const v = `h${level}` as const;
    const styles = {
      ...theme.typography[v],
      p: 0, // reset editor style
      mb: '0.35em', // matches MUI Typography gutterBottom
    };
    return [v, styles];
  }),

  // Sync Delimiter block to theme
  '.ce-delimiter': {
    lineHeight: '1px',
    textAlign: 'initial',
    '&:before': {
      content: '" "',
      borderBottom: `thin solid ${theme.palette.divider}`,
      width: 1,
      lineHeight: 'initial',
      height: 'initial',
      // Padding tweaked here (and below) to be visually centered (including toolbar)
      pt: `calc(${theme.spacing(2)} - 3px)`,
    },
    pb: `calc(${theme.spacing(2)} + 1px)`,
  },
});
