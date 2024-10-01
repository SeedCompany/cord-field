import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  GridState,
  GridRenderCellParams as RenderCellParams,
  useGridSelector,
} from '@mui/x-data-grid';
import { VariantResponseFragment as VariantResponse } from '~/common/fragments';
import {
  RenderFn,
  RichTextRenderers,
  RichTextView,
  Text,
} from '../../../components/RichText';
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
    <Box my={1}>
      <RoleIcon
        variantRole={variant.responsibleRole}
        sx={{ fontSize: 36, float: 'left', mr: 1 }}
      />
      <Box
        sx={{
          overflow: 'hidden',
          textWrap: 'wrap',
          display: isExpanded ? 'contents' : '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',

          // No trailing spacing on response
          '& > *:last-child': { mb: 0 },
        }}
      >
        <RichTextView data={response} renderers={renderers} />
      </Box>
    </Box>
  );
};

const ParagraphBlock: RenderFn<{ text: string }> = ({ data }) => (
  <Typography variant="body2" paragraph>
    <Text data={data} />
  </Typography>
);

const List: RenderFn<{ style: 'unordered' | 'ordered'; items: string[] }> = ({
  data,
}) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!data) return <></>;
  const { style, items } = data;
  return (
    <Box
      component={style === 'unordered' ? 'ul' : 'ol'}
      sx={{ display: 'contents' }}
    >
      {items.map((text, index) => (
        <Typography
          key={index}
          variant="body2"
          component="li"
          gutterBottom
          sx={{
            display: 'block',
            '&::before': {
              content: style === 'unordered' ? `"• "` : `"${index + 1}. "`,
            },
            '&:last-of-type': { mb: 0 },
          }}
        >
          <Text data={{ text }} />
        </Typography>
      ))}
    </Box>
  );
};

const renderers: RichTextRenderers = {
  paragraph: ParagraphBlock,
  list: List,
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
