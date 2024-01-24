import MsgReader from '@freiraum/msgreader';
import { Box, Typography } from '@mui/material';
import { mapEntries } from '@seedcompany/common';
import parseHtml from 'html-react-parser';
import { DateTime } from 'luxon';
import { FormattedDateTime } from '../../../Formatters';
import { PreviewerProps } from '../FilePreview';
import { useFilePreview } from '../useFilePreview';

export const parseEmail = (buffer: ArrayBuffer) => {
  const data = new MsgReader(buffer).getFileData();
  if ('error' in data) {
    throw new Error(data.error);
  }
  const headers = mapEntries(
    (data.headers ?? '').matchAll(/(.*): (.*)/g),
    ([_, k, v], { SKIP }) => (k && v ? [k, v] : SKIP)
  ).asRecord;
  return {
    ...data,
    from: { name: data.senderName, email: data.senderEmail },
    headers,
    bodyHTML: data.bodyHTML,
  };
};
export type Email = ReturnType<typeof parseEmail>;

export const EmailPreview = ({ file }: PreviewerProps) => {
  const email = useFilePreview(file, async (blob) => {
    const buffer = await blob.arrayBuffer();
    return parseEmail(buffer);
  });
  return <OutlookMessage email={email} />;
};

const OutlookMessage = ({ email }: { email: Email }) => (
  <Box width={1}>
    {email.headers.From && <Typography>From: {email.headers.From}</Typography>}
    {email.headers.Date && (
      <Typography>
        Sent:{' '}
        <FormattedDateTime date={DateTime.fromRFC2822(email.headers.Date)} />
      </Typography>
    )}
    {email.headers.To && <Typography>To: {email.headers.To}</Typography>}
    {email.headers.CC && <Typography>CC: {email.headers.CC}</Typography>}
    <Typography paragraph>Subject: {email.subject}</Typography>
    <Typography>
      {email.bodyHTML
        ? parseHtml(email.bodyHTML)
        : parseHtml(
            email.body
              .replace(/[\u00A0-\u9999<>&]/g, (i) => `&#${i.charCodeAt(0)};`)
              .replace(/\r\n/g, '<br>')
          )}
    </Typography>
  </Box>
);

// eslint-disable-next-line import/no-default-export
export default EmailPreview;
