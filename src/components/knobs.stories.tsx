import { date as d } from '@storybook/addon-knobs';
import { DateTime } from 'luxon';
import { CalendarDate } from '../util';

export const date = (name: string, value?: CalendarDate, groupId?: string) =>
  CalendarDate.fromMillis(d(name, value?.toJSDate(), groupId));

export const dateTime = (name: string, value?: DateTime, groupId?: string) =>
  DateTime.fromMillis(d(name, value?.toJSDate(), groupId));
