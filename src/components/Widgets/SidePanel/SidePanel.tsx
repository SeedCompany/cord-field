import { WidgetConfig } from '../../Widgets/widgetConfig';

export const SideWidgetConfig = {
  type: 'BaseWidget',
  colSpan: 4,
  rowSpan: 12,
  key: 'side-panel',
  CardProps: { sx: { p: 0 } },
  slots: {
    title: 'Actions list',
  },
} satisfies WidgetConfig;
