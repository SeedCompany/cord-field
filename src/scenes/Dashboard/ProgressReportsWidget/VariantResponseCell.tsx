import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridRenderCellParams as RenderCellParams } from '@mui/x-data-grid';
import { VariantResponseFragment as VariantResponse } from '~/common/fragments';
import { RoleIcon as BaseRoleIcon } from '../../../components/RoleIcon';
import { ProgressReportsDataGridRowFragment as ProgressReport } from './progressReportsDataGridRow.graphql';
import { RichTextCell } from './RichTextCell';

type CellParams = RenderCellParams<ProgressReport, VariantResponse>;

export const VariantResponseCell = ({ value, ...props }: CellParams) => {
  if (!value) return null;

  const { variant } = value;
  const response = value.response.value!;
  return (
    <Box my={1}>
      <RoleIcon
        variantRole={variant.responsibleRole}
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
      <RoleIcon
        variantRole={value.variant.responsibleRole}
        sx={{ fontSize: 30 }}
      />
    </Box>
  );
};

const RoleIcon = styled(BaseRoleIcon)({
  margin: 0,
});
