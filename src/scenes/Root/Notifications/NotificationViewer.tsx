import { ComponentType } from 'react';
import {
  NotificationFragment as Notification,
  NotificationProp,
} from './Views';

export type Views = {
  [Type in AllTypes]?: ComponentType<{
    notification: NotificationOfType<Type>;
  }>;
};

type NotificationOfType<Type extends AllTypes> = Extract<
  Notification,
  { __typename: `${Type}Notification` }
>;

type AllTypes = Notification['__typename'] extends `${infer T}Notification`
  ? T
  : never;

const getType = (notification: Notification) =>
  (notification.__typename.match(/^(.*)Notification$/)?.[1] ??
    notification.__typename) as AllTypes;

export const NotificationViewer = ({
  notification,
  views,
}: NotificationProp & { views: Views }) => {
  const Concrete = views[getType(notification)] as
    | ComponentType<NotificationProp>
    | undefined;
  if (!Concrete) {
    return null;
  }
  return <Concrete notification={notification} />;
};
