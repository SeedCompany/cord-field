import { Views } from './Base';
import { CommentViaMention } from './CommentViaMention';
import { System } from './System';

export const views: Views = {
  System,
  CommentViaMention,
};

export type { NotificationProp } from './Base';
export type { NotificationFragment } from './notification.graphql';
