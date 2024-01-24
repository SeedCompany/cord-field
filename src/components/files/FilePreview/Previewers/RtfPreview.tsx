import * as rtfToHTML from '@iarna/rtf-to-html';
import parse from 'html-react-parser';
import { PreviewerProps } from '../FilePreview';
import { useFilePreview } from '../useFilePreview';

export const RtfPreview = ({ file }: PreviewerProps) => {
  const html = useFilePreview(file, async (blob) => {
    const rtfStr = await blob.text();
    try {
      const htmlStr = await parseRtlToHtml(rtfStr, rtfOptions);
      return parse(htmlStr);
    } catch (e) {
      console.error(e);
      throw new Error('Could not read document file');
    }
  });

  return <div style={{ width: '80ch' }}>{html}</div>;
};

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
