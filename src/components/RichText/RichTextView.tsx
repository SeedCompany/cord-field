import type { OutputData as RichTextData } from '@editorjs/editorjs';
import { Divider, Typography } from '@mui/material';
import Blocks from 'editorjs-blocks-react-renderer';
import HTMLReactParser from 'html-react-parser';
import { memo, ReactElement, useMemo } from 'react';
import { ToolKey } from './editorJsTools';

export type RichTextRenderers = { [K in ToolKey]?: RenderFn<any> };

export type RenderFn<T = undefined> = (_: { data?: T }) => ReactElement;

export const RichTextView = memo(function RichTextView({
  data,
  renderers: renderersInput,
}: {
  data?: RichTextData | null;
  renderers?: RichTextRenderers;
}) {
  const renderers = useMemo(
    () => ({ ...defaultRenderers, ...renderersInput }),
    [renderersInput]
  );
  if (!data) {
    return null;
  }
  const data1 = { version: '0', time: 0, ...data };
  return <Blocks data={data1} renderers={renderers} />;
});

const ParagraphBlock: RenderFn<{ text: string }> = ({ data }) => (
  <Typography paragraph>
    <Text data={data} />
  </Typography>
);

export const Text: RenderFn<{ text: string }> = ({ data }) => {
  const { text } = data ?? {};
  return <>{text && HTMLReactParser(text)}</>;
};

const HeaderBlock: RenderFn<{ text: string; level: 1 | 2 | 3 | 4 | 5 | 6 }> = ({
  data,
}) => {
  const { text, level = 1 } = data ?? {};
  return (
    <Typography variant={`h${level}`} gutterBottom>
      {text && HTMLReactParser(text)}
    </Typography>
  );
};

const DelimiterBlock: RenderFn = () => <Divider sx={{ my: 2 }} />;

const defaultRenderers: RichTextRenderers = {
  paragraph: ParagraphBlock,
  header: HeaderBlock,
  delimiter: DelimiterBlock,
};
