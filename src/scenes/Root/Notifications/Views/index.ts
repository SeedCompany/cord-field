import { Views } from './Base';
import { CommentViaMention } from './CommentViaMention';
import { ProjectTransitionRequiringFinancialApproval } from './ProjectTransitionRequiringFinancialApproval';
import { ProjectTransitionViaMembership } from './ProjectTransitionViaMembership';
import { System } from './System';

export const views: Views = {
  System,
  CommentViaMention,
  ProjectTransitionViaMembership,
  ProjectTransitionRequiringFinancialApproval,
};

export type { NotificationProp } from './Base';
export type { NotificationFragment } from './notification.graphql';
