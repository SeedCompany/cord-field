import { Box, Typography } from '@mui/material';
import { GridRenderCellParams as RenderCellParams } from '@mui/x-data-grid';
import { RichTextJson, StyleProps } from '~/common';
import { ExpansionCell } from '../../scenes/Dashboard/ProgressReportsWidget/ExpansionCell';
import { ProgressReportsDataGridRowFragment as ProgressReport } from '../../scenes/Dashboard/ProgressReportsWidget/progressReportsDataGridRow.graphql';
import { BlockProps, Renderers, RichTextView, Text } from '../RichText';

type CellParams = RenderCellParams<ProgressReport, RichTextJson>;

export const RichTextCell = (
  props: Pick<CellParams, 'value' | 'id' | 'api'> & StyleProps
) => {
  if (!props.value) return null;

  return (
    <ExpansionCell {...props}>
      <RichTextView data={props.value} renderers={renderers} />
    </ExpansionCell>
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
