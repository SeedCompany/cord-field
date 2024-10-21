import { Typography } from '@mui/material';
import { BaseView, Views } from './Base';

export const SimpleText: Views['SimpleText'] = ({ notification }) => (
  <BaseView notification={notification}>
    <Typography variant="body2">{notification.content}</Typography>
  </BaseView>
);
