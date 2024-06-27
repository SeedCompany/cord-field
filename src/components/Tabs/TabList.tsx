import { TabList as MUITabList, TabContext } from '@mui/lab';
import { Tab } from '@mui/material';
import { ReactNode } from 'react';
import { EnumParam, makeQueryHandler, withDefault } from '~/hooks';

interface TabListProps<T extends string> {
  children: ReactNode;
  tabProps: {
    labels: Array<{ label: string; value: T }>;
    default: T;
  };
}

export const TabList = <T extends string>(props: TabListProps<T>) => {
  const { children, tabProps } = props;

  const labels = tabProps.labels.map((label) => label.value);
  const [tabs, setTabs] = makeQueryHandler({
    tab: withDefault(EnumParam(labels), tabProps.default),
  })();

  return (
    <TabContext value={tabs.tab}>
      <MUITabList
        onChange={(_e, tab) => setTabs({ tab })}
        aria-label="navigation tabs"
        variant="scrollable"
      >
        {tabProps.labels.map((label) => (
          <Tab key={label.value} label={label.label} value={label.value} />
        ))}
      </MUITabList>
      {children}
    </TabContext>
  );
};
