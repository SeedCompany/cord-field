import { List, ListItem } from '@mui/material';
import { differenceBy, identity, unionBy } from 'lodash';
import { ReactNode } from 'react';
import { Entity } from '~/api';
import { UnsecuredProp, unwrapSecured } from '~/common';
import { ChangesetBadge } from './ChangesetBadge';
import {
  EntityFromChangesetDiff,
  useChangesetDiffItem,
} from './ChangesetDiffContext';

type ArrayItemType<T> = T extends Array<infer P> ? P : T; //Should I make this recursive? I'm thinking not.

interface Props<
  Obj,
  Key extends keyof Obj,
  PropItemList extends UnsecuredProp<Obj[Key]> & any[],
  Item extends ArrayItemType<PropItemList>
> {
  current: Obj;
  prop: Key;

  /**
   * If each item in the list is an object, which key should we display and use for comparing items in the list?
   * @default identity of the propItem itself (hopefully a simple type)
   */
  listItemKey?: keyof Item;

  /**
   * How to render each item in the propList
   */
  renderListItem: (item: Item) => ReactNode;
}

export const ChangesetPropList = <
  Obj extends Entity,
  Key extends keyof EntityFromChangesetDiff<Obj> & keyof Obj,
  Item extends UnsecuredProp<Obj[Key]> & any[],
  ListItem extends ArrayItemType<Item>
>(
  props: Props<Obj, Key, Item, ListItem>
) => {
  const { current, prop, listItemKey, renderListItem } = props;
  const { previous } = useChangesetDiffItem(current);
  const currentProp = unwrapSecured(current[prop]) as Item;

  if (!previous) {
    return (
      <List disablePadding>
        {currentProp.map((item, i) => (
          <ListItem disableGutters key={i}>
            {renderListItem(item)}
          </ListItem>
        ))}
      </List>
    );
  }
  if (!(prop in previous)) {
    console.error(
      `${previous.__typename}.${String(
        prop
      )} has not been requested in ChangesetDiff`
    );
    return null;
  }

  const originalProp = unwrapSecured(previous[prop]) as Item;

  // get diff between current and orig for added.
  const added = differenceBy(
    currentProp,
    originalProp,
    listItemKey ?? identity
  );
  // get diff between orig and current for deleted.
  const deleted = differenceBy(
    originalProp,
    currentProp,
    listItemKey ?? identity
  );

  const allItems = unionBy(currentProp, originalProp, listItemKey ?? identity);

  // return a List, with each ListItem being an added/deleted/undefined changesetbadge
  return (
    <List disablePadding>
      {allItems.map((item, i) => (
        <ChangesetBadge
          anchorOrigin={{ horizontal: 'right' }}
          mode={
            added.includes(item)
              ? 'added'
              : deleted.includes(item)
              ? 'removed'
              : undefined
          }
          key={`${item}-${i}`}
        >
          <ListItem disableGutters>{renderListItem(item)}</ListItem>
        </ChangesetBadge>
      ))}
    </List>
  );
};
