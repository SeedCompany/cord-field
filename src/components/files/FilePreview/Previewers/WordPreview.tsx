import { css } from '@emotion/react';
import parse from 'html-react-parser';
import mammoth, { MammothOptions } from 'mammoth';
import { PreviewerProps } from '../FilePreview';
import { useFilePreview } from '../useFilePreview';

const mammothOptions: MammothOptions = {
  styleMap: ['u => em'],
};

const styles = css`
  & img {
    max-width: 100%;
  }
`;

export const WordPreview = ({ file }: PreviewerProps) => {
  const html = useFilePreview(file, async (blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    try {
      const result = await mammoth.convertToHtml(
        { arrayBuffer },
        mammothOptions
      );
      return parse(result.value);
    } catch (e) {
      console.error(e);
      throw new Error('Could not read document file');
    }
  });

  return <div css={styles}>{html}</div>;
};

// eslint-disable-next-line import/no-default-export
export default WordPreview;
