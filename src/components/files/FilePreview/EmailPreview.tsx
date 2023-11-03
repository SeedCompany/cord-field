import MsgReader from '@freiraum/msgreader';
import { Typography } from '@mui/material';
import { mapEntries } from '@seedcompany/common';
import parseHtml from 'html-react-parser';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { FormattedDateTime } from '../../Formatters';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';

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

export const EmailPreview = (props: PreviewerProps) => {
  const { file, previewLoading, setPreviewLoading, setPreviewError } = props;
  const [html, setHtml] = useState<JSX.Element | JSX.Element[] | null>(null);

  const extractHtmlFromDocument = useCallback(
    async (file: File) => {
      const buffer = await file.arrayBuffer();
      try {
        const email = parseEmail(buffer);
        setHtml(<OutlookMessage email={email} />);
        setPreviewLoading(false);
      } catch {
        setPreviewError('Could not read outlook message');
      }
    },
    [setPreviewLoading, setPreviewError]
  );

  useEffect(() => {
    if (file) {
      void extractHtmlFromDocument(file);
    }
  }, [file, extractHtmlFromDocument]);

  return previewLoading ? <PreviewLoading /> : <>{html}</>;
};

const useStyles = makeStyles()(() => ({
  root: {
    width: '100%',
  },
}));

const OutlookMessage = ({ email }: { email: Email }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      {email.headers.From && (
        <Typography>From: {email.headers.From}</Typography>
      )}
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
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default EmailPreview;
