import { Box } from '@mui/material';
import { PreviewerProps } from '../FilePreview';
import { useFilePreview } from '../useFilePreview';

// https://modernfontstacks.com/#monospace-code
const MonospaceCode =
  "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace";

export const PlainTextPreview = ({ file }: PreviewerProps) => {
  const html = useFilePreview(file, async (blob) => {
    const textContent = await blob.text();
    try {
      const newLineCharacter =
        textContent.split('\r\n').length > 1
          ? '\r\n'
          : textContent.split('\n').length > 1
          ? '\n'
          : '\r';
      const lines = textContent.split(newLineCharacter);
      return lines.map((line, index) => (
        <Box
          component="p"
          key={index}
          whiteSpace="pre-wrap"
          fontFamily={MonospaceCode}
        >
          {line}
        </Box>
      ));
    } catch (e) {
      console.error(e);
      throw new Error('Could not read document file');
    }
  });

  return <div style={{ width: '80ch' }}>{html}</div>;
};
