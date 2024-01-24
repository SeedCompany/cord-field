import { PreviewerProps } from '../FilePreview';

export const HtmlPreview = ({ file }: PreviewerProps) => (
  <iframe
    src={file.url}
    width={800}
    height={600}
    title={file.name}
    referrerPolicy="no-referrer"
  />
);
