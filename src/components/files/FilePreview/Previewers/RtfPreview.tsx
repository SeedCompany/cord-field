import * as rtfToHTML from '@iarna/rtf-to-html';
import parse from 'html-react-parser';
import { PreviewerProps } from '../FilePreview';
import { useFilePreview } from '../useFilePreview';

export const RtfPreview = ({ file }: PreviewerProps) => {
  const html = useFilePreview(file, async (blob) => {
    try {
      return await parseRtf(await blob.text());
    } catch (e) {
      console.error(e);
      throw new Error('Could not read document file');
    }
  });

  return <div style={{ width: '80ch' }}>{html}</div>;
};

/** RTF text to React nodes. Shared with the Word previewer for mis-tagged files. */
export const parseRtf = async (rtfStr: string) =>
  parse(await parseRtlToHtml(rtfStr, rtfOptions));

// eslint-disable-next-line import/no-default-export
export default RtfPreview;

const parseRtlToHtml = async (
  rtfStr: string,
  options?: rtfToHTML.RtfToHtmlOptions
) =>
  await new Promise<string>((resolve, reject) => {
    rtfToHTML.fromString(rtfStr, options, (error, html) =>
      error || !html ? reject(error) : resolve(html)
    );
  });

const rtfOptions = {
  template: (
    _: rtfToHTML.RtfToHtmlDoc,
    __: rtfToHTML.RtfToHtmlDefaults,
    content: string
  ) => {
    // Adding this wrapper <div> prevents the library from adding
    // <html> and <body> tags
    return `
      <div>
        ${content.replace(/\n/, '\n    ')}
      </div>
    `;
  },
};
