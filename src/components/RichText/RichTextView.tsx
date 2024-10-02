import type { OutputData as RichTextData } from '@editorjs/editorjs';
import { Divider, Typography } from '@mui/material';
import Blocks from 'editorjs-blocks-react-renderer';
import HTMLReactParser from 'html-react-parser';
import { ComponentType, memo, useMemo } from 'react';
import { BlockDataMap, ToolKey } from './editorJsTools';

export type Renderers = {
  [K in ToolKey]?: ComponentType<BlockProps<K>>;
};

export interface BlockProps<K extends ToolKey> {
  data?: K extends keyof BlockDataMap ? BlockDataMap[K] : never;
  className?: string;
}

export const RichTextView = memo(function RichTextView({
  data,
  renderers: renderersInput,
}: {
  data?: RichTextData | null;
  renderers?: Renderers;
}) {
  const renderers = useMemo(
    () => ({ ...defaultRenderers, ...renderersInput }),
    [renderersInput]
  );
  if (!data) {
    return null;
  }
  const data1 = { version: '0', time: 0, ...data };
  return (
    <Blocks
      data={data1}
      // @ts-expect-error our types are stricter
      renderers={renderers}
    />
  );
});

const ParagraphBlock = ({ data }: BlockProps<'paragraph'>) => (
  <Typography paragraph>
    <Text data={data} />
  </Typography>
);

export const Text = ({ data }: BlockProps<'paragraph'>) => {
  const { text } = data ?? {};
  return <>{text && HTMLReactParser(text)}</>;
};

const HeaderBlock = ({ data }: BlockProps<'header'>) => {
  const { text, level = 1 } = data ?? {};
  return (
    <Typography variant={`h${level}`} gutterBottom>
      {text && HTMLReactParser(text)}
    </Typography>
  );
};

const DelimiterBlock = () => <Divider sx={{ my: 2 }} />;

const defaultRenderers: Renderers = {
  paragraph: ParagraphBlock,
  header: HeaderBlock,
  delimiter: DelimiterBlock,
};
