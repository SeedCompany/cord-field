import { Button, Typography } from '@mui/material';
import { BaseView, Views } from './Base';

export const CommentViaMention: Views['CommentViaMention'] = ({
  notification,
}) => (
  <BaseView
    notification={notification}
    component={Button}
    onClick={() =>
      // TODO replace with navigation to comment
      console.log(
        'You clicked on a comment mentioned',
        notification.comment.container
      )
    }
  >
    <Typography color="text.primary">
      {notification.comment.creator.fullName} mentioned you in a comment
    </Typography>
  </BaseView>
);
