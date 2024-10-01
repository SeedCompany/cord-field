import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  GridState,
  GridRenderCellParams as RenderCellParams,
  useGridSelector,
} from '@mui/x-data-grid';
import { VariantResponseFragment as VariantResponse } from '~/common/fragments';
import { RichTextView } from '../../../components/RichText';
import { RoleIcon as BaseRoleIcon } from '../../../components/RoleIcon';
import { ProgressReportsDataGridRowFragment as ProgressReport } from './progressReportsDataGridRow.graphql';

type CellParams = RenderCellParams<ProgressReport, VariantResponse>;

export const VariantResponseCell = ({ value, ...props }: CellParams) => {
  const selectedRows = useGridSelector(
    { current: props.api },
    (state: GridState) => state.rowSelection
  );
  const isExpanded = selectedRows[0] === props.id;

  if (!value) return null;

  const { variant } = value;
  const response = value.response.value!;
  return (
    <Box
      sx={{
        my: 1,

        overflow: 'hidden',
        textWrap: 'wrap',
        display: isExpanded ? undefined : '-webkit-box',
        WebkitLineClamp: '2',
        WebkitBoxOrient: 'vertical',

        // No trailing spacing on response
        '& > *:last-child': { mb: 0 },
      }}
    >
      <RoleIcon
        variantRole={variant.responsibleRole}
        sx={{ fontSize: 36, float: 'left', mr: 1 }}
      />
      <RichTextView data={response} />
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
