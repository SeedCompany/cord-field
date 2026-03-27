import { Add } from '@mui/icons-material';
import { Button, Stack, Tooltip } from '@mui/material';

export interface AddItemFooterOptions {
  addItem: () => void;
  label?: string;
  tooltipTitle?: string;
  disabled?: boolean;
}

/**
 * Factory function that creates a footer component for DataGrid with an add button.
 * Use this to create a footer slot for MUI DataGrid that allows adding new items.
 *
 * @example
 * ```tsx
 * const slots = useMemo(
 *   () => ({
 *     footer: createAddItemFooter({
 *       addItem: handleAdd,
 *       label: 'Add Partner',
 *     }),
 *   }),
 *   [handleAdd]
 * );
 * ```
 */
export const createAddItemFooter = ({
  addItem,
  label,
  tooltipTitle,
  disabled = false,
}: AddItemFooterOptions) => {
  const Footer = () => {
    const title = tooltipTitle ?? label;
    const button = (
      <span>
        {/* span is needed to wrap disabled button for tooltip to work */}
        <Button
          onClick={addItem}
          disabled={disabled}
          variant="outlined"
          color="primary"
          size="small"
          sx={{ minWidth: 'auto', px: 1 }}
        >
          <Add />
        </Button>
      </span>
    );
    return (
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          background: 'var(--DataGrid-containerBackground)',
          p: 1,
          borderTop: 'thin solid var(--DataGrid-rowBorderColor)',
          borderBottomLeftRadius: 'inherit',
          borderBottomRightRadius: 'inherit',
        }}
      >
        {title ? <Tooltip title={title}>{button}</Tooltip> : button}
      </Stack>
    );
  };
  Footer.displayName = 'AddItemFooter';
  return Footer;
};
