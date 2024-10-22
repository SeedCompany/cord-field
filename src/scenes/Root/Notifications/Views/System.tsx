import { Typography } from '@mui/material';
import Markdown from 'markdown-to-jsx';
import { BaseView, Views } from './Base';

export const System: Views['System'] = ({ notification }) => (
  <BaseView notification={notification}>
    <Typography color="text.primary">
      <Markdown>{notification.message}</Markdown>
    </Typography>
  </BaseView>
);
