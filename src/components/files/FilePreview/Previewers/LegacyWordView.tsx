import { Alert, Box } from '@mui/material';
import type { LegacyWordBlock, LegacyWordDocument } from './legacyWord';

/**
 * Text-only pages for a Word 97–2003 file, laid out like the docx desk so the
 * two formats feel like the same previewer.
 */
export const LegacyWordView = ({
  document,
}: {
  document: LegacyWordDocument;
}) => (
  <div className="doc-desk">
    <Alert severity="info" sx={{ width: '8.5in', maxWidth: 1, mb: '30px' }}>
      Text-only preview. This file is in the older .doc format, so formatting,
      images, text boxes and comments aren&apos;t shown. Download it to see the
      original.
    </Alert>
    {document.pages.map((blocks, index) => (
      <section key={index}>
        {index === 0 && document.header && (
          <PageEdge>{document.header}</PageEdge>
        )}
        {blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
        {index === document.pages.length - 1 && document.notes && (
          <PageEdge>{document.notes}</PageEdge>
        )}
        {index === document.pages.length - 1 && document.footer && (
          <PageEdge>{document.footer}</PageEdge>
        )}
      </section>
    ))}
  </div>
);

const Block = ({ block }: { block: LegacyWordBlock }) =>
  block.type === 'paragraph' ? (
    <Paragraph text={block.text} />
  ) : (
    <Box component="table" sx={tableStyles}>
      <tbody>
        {block.rows.map((cells, r) => (
          <tr key={r}>
            {cells.map((paragraphs, c) => (
              <td key={c}>
                {paragraphs.map((text, p) => (
                  <Paragraph key={p} text={text} />
                ))}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Box>
  );

// Word keeps empty paragraphs one line tall, which is how authors space things.
const Paragraph = ({ text }: { text: string }) => (
  <p style={{ margin: 0, minHeight: '1em', whiteSpace: 'pre-wrap' }}>{text}</p>
);

const PageEdge = ({ children }: { children: string }) => (
  <Box
    component="p"
    sx={{
      m: 0,
      mb: 2,
      color: 'grey.600',
      fontSize: '0.85em',
      whiteSpace: 'pre-wrap',
    }}
  >
    {children}
  </Box>
);

const tableStyles = {
  width: 1,
  my: '0.5em',
  borderCollapse: 'collapse',
  '& td': {
    border: '1px solid',
    borderColor: 'grey.500',
    p: '2px 4px',
    verticalAlign: 'top',
  },
} as const;
