import { Typography } from '@mui/material';
import { filter } from 'lodash';
import { ReactNode, useContext } from 'react';
import { Entity } from '~/api';
import { mapFromList, unwrapSecured } from '~/common';
import { ParentIdFragment as ParentId } from '~/common/fragments';
import { ChangesetBadge } from './ChangesetBadge';
import { ChangesetDiffContext, ProcessedDiff } from './ChangesetDiffContext';
import { PropertyDiff } from './PropertyDiff';

interface Props<Obj, Id extends ParentId> {
  parent?: Obj;
  children: ReactNode;

  // TODO: not sure how identifyBy, labelBy, and renderChange would be passed/used for any level in the tree unless
  //       an object was passed in with labelBy for the keys of (maybe each) level. For instance:
  //    {
  //       ${KEY_OF_CHILD_OR_GRANDCHILD}: {"identifyBy": ${DO_SOMETHING},  "labelBy": ${DO_SOMETHING_ELSE}, "renderChange": ${DO_SOMETHING_AGAIN}}
  //    }
  /**
   * How should this item be labeled in UI
   * @default identity
   */
  //labelBy?: (item: Item) => ReactNode;
  /**
   * How should this item be identified to test if it has changed?
   * @default identity
   */
  //identifyBy?: (item: Item) => any;
  /**
   * Customize the rendering of the property change.
   * This is only called if there is a change.
   */
  // renderChange?: (props: { previous: Item; current: Item }) => ReactNode;
}

export const ChangesetChildrenBadge = <
  Obj extends Entity | null,
  Id extends ParentId
>(
  props: Props<Obj, Id>
) => {
  const { parent, children } = props;
  const { diff } = useContext(ChangesetDiffContext);

  if (!parent) {
    return <>{children}</>;
  }

  const isDiff = hasChangeInTree(parent.id, diff) ? 'changed' : undefined;
  return (
    <ChangesetBadge
      mode={isDiff}
      moreInfo={<PropertyDiffTree parentId={parent.id} diff={diff} />}
    >
      {children}
    </ChangesetBadge>
  );
};

const PropertyDiffTree = (props: { parentId: string; diff: ProcessedDiff }) => {
  const diff = props.diff;
  const propChanges = getPropChanges(props.parentId, diff);

  if (propChanges) {
    return (
      <>
        {Object.entries(propChanges.changesByProp).map(([propKey, propVal]) => (
          <div key={propKey}>
            <Typography
              key={`${propChanges.__typename}-${propKey}`}
            >{`${propChanges.__typename}: ${propKey}`}</Typography>
            <PropertyDiff
              key={propKey}
              previous={propVal.previous ?? <i>Empty</i>} //TODO: I SO need something better than this...
              current={propVal.updated ?? <i>Empty</i>}
            />
          </div>
        ))}
      </>
    );
  }
  const childIdsChanged = changedChildrenIds(props.parentId, diff);
  if (childIdsChanged.length > 0) {
    return (
      <>
        {childIdsChanged.map((id, i) => (
          <PropertyDiffTree key={i} parentId={id} diff={diff} />
        ))}
      </>
    );
  } else {
    // Disable lint here because we must return an empty fragment
    // at any point in the tree of a recursive React element.
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
};

const hasChangeInTree = (id: string, diff: ProcessedDiff): boolean => {
  const propChanges = getPropChanges(id, diff);
  if (propChanges) {
    return true;
  } else {
    const childIdsChanged = changedChildrenIds(id, diff);
    if (childIdsChanged.length > 0) return true;
  }
  return false;
};

const changedChildrenIds = (id: string, diff: ProcessedDiff) => {
  const childrenChanges = filter(diff.changed, (item) => {
    if (
      'parent' in item.previous &&
      item.previous.parent &&
      'id' in item.previous.parent
    ) {
      return item.previous.parent.id === id;
    }
    return false;
  });
  return childrenChanges.map((val) => val.previous.id);
};

const getPropChanges = (parentId: string, diff: ProcessedDiff) => {
  const changeDiffOfId = filter(
    diff.changed,
    (val) => val.previous.id === parentId
  )[0]; //there will only be one object for all props changed immediately under that object;
  if (changeDiffOfId) {
    type KeysOfChangesetDiff =
      | (keyof typeof changeDiffOfId.previous &
          keyof typeof changeDiffOfId.updated)
      | 'changeset'
      | 'parent';

    type KeysOfOnlyChangedProps = Exclude<
      KeysOfChangesetDiff,
      'changeset' | 'parent'
    >;

    const isAPropKey = (
      prop: KeysOfChangesetDiff
    ): prop is KeysOfOnlyChangedProps => {
      return prop !== 'changeset' && prop !== 'parent';
    };

    const propKeys: KeysOfChangesetDiff[] = Object.keys(
      changeDiffOfId.previous
    ) as KeysOfChangesetDiff[];

    const changesByProp = mapFromList(
      propKeys,
      (keyName: KeysOfChangesetDiff) => {
        if (isAPropKey(keyName)) {
          const prevVal = unwrapSecured(changeDiffOfId.previous[keyName]);
          const currVal = unwrapSecured(changeDiffOfId.updated[keyName]);
          return prevVal !== currVal
            ? [keyName, { previous: prevVal, updated: currVal }]
            : null;
        }
        return null;
      }
    );

    return {
      __typename: changeDiffOfId.previous.__typename,
      changesByProp,
    };
  }
};
