import { identity } from 'lodash';
import { ReactNode } from 'react';
import { Entity } from '~/api';
import { UnsecuredProp, unwrapSecured } from '~/common';
import { ChangesetBadge } from './ChangesetBadge';
import {
  EntityFromChangesetDiff,
  useChangesetDiffItem,
} from './ChangesetDiffContext';
import { PropertyDiff } from './PropertyDiff';

interface Props<
  Obj,
  Key extends keyof Obj,
  Item extends UnsecuredProp<Obj[Key]>
> {
  current?: Obj;
  prop: Key;
  /**
   * How should this item be labeled in UI
   * @default identity
   */
  labelBy?: (item: Item) => ReactNode;
  /**
   * How should this item be identified to test if it has changed?
   * @default identity
   */
  identifyBy?: (item: Item) => any;
  /**
   * Customize the rendering of the property change.
   * This is only called if there is a change.
   */
  renderChange?: (props: { previous: Item; current: Item }) => ReactNode;
  children: ReactNode;
}

export const ChangesetPropertyBadge = <
  Obj extends Entity,
  Key extends keyof EntityFromChangesetDiff<Obj> & keyof Obj,
  Item extends UnsecuredProp<Obj[Key]>
>(
  props: Props<Obj, Key, Item>
) => {
  const {
    current,
    prop,
    labelBy,
    identifyBy: identifyByProp,
    renderChange,
    children,
  } = props;
  const { previous } = useChangesetDiffItem(current);

  if (!current || !previous) {
    return <>{children}</>;
  }
  if (!(prop in previous)) {
    const propStr = String(prop);
    console.error(
      `${previous.__typename}.${propStr} has not been requested in ChangesetDiff`
    );
    return <>{children}</>;
  }

  const currentProp = unwrapSecured(current[prop]) as Item;
  const originalProp = unwrapSecured(previous[prop]) as Item;
  const identifyBy = identifyByProp ?? identity;
  const isDiff = identifyBy(currentProp) !== identifyBy(originalProp);

  return (
    <ChangesetBadge
      mode={isDiff ? 'changed' : undefined}
      moreInfo={
        isDiff ? (
          renderChange ? (
            renderChange({
              previous: originalProp,
              current: currentProp,
            }) ?? ''
          ) : (
            <PropertyDiff
              previous={originalProp}
              current={currentProp}
              labelBy={labelBy}
            />
          )
        ) : null
      }
    >
      {children}
    </ChangesetBadge>
  );
};
