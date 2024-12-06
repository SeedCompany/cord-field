import { Box, Tooltip } from '@mui/material';
import { GridRenderCellParams as RenderCellParams } from '@mui/x-data-grid';
import { StyleProps } from '~/common';
import {
  VariantFragment as Variant,
  VariantResponseFragment as VariantResponse,
} from '~/common/fragments';
import { RichTextCell } from '../../../components/Grid/RichTextCell';
import { RoleIcon as BaseRoleIcon } from '../../../components/RoleIcon';
import { ProgressReportsDataGridRowFragment as ProgressReport } from './progressReportsDataGridRow.graphql';

type CellParams = RenderCellParams<ProgressReport, VariantResponse>;

export const VariantResponseCell = ({ value, ...props }: CellParams) => {
  if (!value) return null;

  const response = value.response.value!;
  return (
    <Box my={1}>
      <VariantIcon
        variant={value.variant}
        sx={{ fontSize: 36, float: 'left', mr: 1 }}
      />
      <RichTextCell value={response} {...props} />
    </Box>
  );
};

export const VariantResponseIconCell = ({ value }: CellParams) => {
  if (!value) return null;
  return (
    <Box
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <VariantIcon variant={value.variant} sx={{ fontSize: 30 }} />
    </Box>
  );
};

const VariantIcon = ({
  variant,
  ...props
}: StyleProps & { variant: Variant }) => (
  <Tooltip title={variant.label}>
    <BaseRoleIcon variantRole={variant.responsibleRole} {...props} />
  </Tooltip>
);
