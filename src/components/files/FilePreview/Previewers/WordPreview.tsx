import { Box } from '@mui/material';
import { parseAsync, renderDocument } from 'docx-preview';
import type { Options as DocxOptions } from 'docx-preview';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { PreviewerProps } from '../FilePreview';
import { useFilePreview } from '../useFilePreview';
import type { LegacyWordDocument } from './legacyWord';
import { LegacyWordView } from './LegacyWordView';

type WordContent =
  | { kind: 'docx'; nodes: Node[] }
  | { kind: 'doc'; document: LegacyWordDocument }
  | { kind: 'rtf'; html: ReactNode };

export const WordPreview = ({ file }: PreviewerProps) => {
  const content = useFilePreview(file, parseWord);
  if (content.kind === 'rtf') {
    return <div style={{ width: '80ch' }}>{content.html}</div>;
  }
  return (
    <Box sx={deskStyles}>
      {content.kind === 'docx' ? (
        <DocxPages nodes={content.nodes} />
      ) : (
        <LegacyWordView document={content.document} />
      )}
    </Box>
  );
};

/**
 * Files tagged as Word come in three real formats, and the tag is not always
 * right, so the first bytes decide. Each parser loads only when needed.
 */
const parseWord = async (blob: Blob): Promise<WordContent> => {
  const data = await blob.arrayBuffer();
  const format = sniffFormat(new Uint8Array(data).subarray(0, 8));
  if (!format) {
    throw new Error("This isn't a Word, RTF or Word 97 file");
  }
  try {
    switch (format) {
      case 'docx': {
        const doc = await parseAsync(data, docxOptions);
        return { kind: 'docx', nodes: await renderDocument(doc, docxOptions) };
      }
      case 'doc': {
        const { parseLegacyWord } = await import('./legacyWord');
        return { kind: 'doc', document: await parseLegacyWord(data) };
      }
      case 'rtf': {
        const { parseRtf } = await import('./RtfPreview');
        const text = new TextDecoder().decode(data);
        return { kind: 'rtf', html: await parseRtf(text) };
      }
    }
  } catch (e) {
    console.error(e);
    throw new Error('Could not read document file');
  }
};

const sniffFormat = (head: Uint8Array) =>
  head[0] === 0x50 && head[1] === 0x4b // "PK": a zip, so OOXML
    ? 'docx'
    : head[0] === 0xd0 &&
      head[1] === 0xcf &&
      head[2] === 0x11 &&
      head[3] === 0xe0 // OLE compound file
    ? 'doc'
    : head[0] === 0x7b &&
      head[1] === 0x5c &&
      head[2] === 0x72 &&
      head[3] === 0x74 &&
      head[4] === 0x66 // "{\rtf"
    ? 'rtf'
    : undefined;

const docxOptions: Partial<DocxOptions> = {
  // Honor the page breaks Word recorded when it last laid out the document,
  // so the preview paginates in the same places as the real file.
  ignoreLastRenderedPageBreak: false,
  // Show the final text rather than tracked-change markup.
  renderChanges: false,
  renderComments: false,
};

const DocxPages = ({ nodes }: { nodes: Node[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    // The renderer produces real DOM (pages plus their scoped <style> tags),
    // not React elements, so it has to be mounted imperatively.
    container.replaceChildren(...nodes);
    return () => container.replaceChildren();
  }, [nodes]);
  return <div ref={containerRef} />;
};

/**
 * The gray "desk" with white pages, bled out to the edges of the dialog
 * content. docx-preview draws its own (`.docx-wrapper`); the legacy view
 * mirrors it so both formats look like the same previewer.
 */
const deskStyles = (theme: { palette: { mode: string } }) => ({
  mx: -3,
  mb: -2.5,
  '& .docx-wrapper, & .doc-desk': {
    bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.300',
    // Pages are a fixed physical width. When the dialog is narrower (phones),
    // keep the desk as wide as its pages so they stay centered and the dialog
    // scrolls instead of cropping them.
    minWidth: 'fit-content',
  },
  '& .doc-desk': {
    p: '30px',
    pb: 0,
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
  },
  '& .doc-desk > section': {
    boxSizing: 'border-box',
    width: '8.5in',
    minHeight: '11in',
    p: '1in',
    mb: '30px',
    bgcolor: 'white',
    color: 'black',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: '12pt',
    lineHeight: 1.3,
  },
});

// eslint-disable-next-line import/no-default-export
export default WordPreview;
