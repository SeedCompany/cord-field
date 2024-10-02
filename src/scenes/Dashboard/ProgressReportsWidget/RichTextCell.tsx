import { Box, Typography } from '@mui/material';
import {
  GridState,
  GridRenderCellParams as RenderCellParams,
  useGridSelector,
} from '@mui/x-data-grid';
import { extendSx, RichTextJson, StyleProps } from '~/common';
import {
  BlockProps,
  Renderers,
  RichTextView,
  Text,
} from '../../../components/RichText';
import { ProgressReportsDataGridRowFragment as ProgressReport } from './progressReportsDataGridRow.graphql';

type CellParams = RenderCellParams<ProgressReport, RichTextJson>;

export const RichTextCell = ({
  id,
  value,
  api,
  sx,
  className,
}: Pick<CellParams, 'value' | 'id' | 'api'> & StyleProps) => {
  const selectedRows = useGridSelector(
    { current: api },
    (state: GridState) => state.rowSelection
  );
  const isExpanded = selectedRows.includes(id);

  if (!value) return null;

  return (
    <Box
      sx={[
        {
          overflow: 'hidden',
          textWrap: 'wrap',
          display: isExpanded ? 'contents' : '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',

          // No trailing spacing on response
          '& > *:last-child': { mb: 0 },
        },
        ...extendSx(sx),
      ]}
      className={className}
    >
      <RichTextView data={value} renderers={renderers} />
    </Box>
  );
};

const ParagraphBlock = ({ data }: BlockProps<'paragraph'>) => (
  <Typography variant="body2" paragraph>
    <Text data={data} />
  </Typography>
);

const List = ({ data }: BlockProps<'list'>) => {
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

const renderers: Renderers = {
  paragraph: ParagraphBlock,
  list: List,
};
