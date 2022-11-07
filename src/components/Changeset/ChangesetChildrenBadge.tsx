import { Typography } from '@mui/material';
import { filter } from 'lodash';
import { ReactNode, useContext } from 'react';
import { Entity } from '~/api';
import { unwrapSecured } from '~/common';
import { ParentIdFragment as ParentId } from '~/common/fragments';
import { ChangesetBadge } from './ChangesetBadge';
import { ChangesetDiffContext } from './ChangesetDiffContext';
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

  if (!parent) {
    return <>{children}</>;
  }

  return (
    <ChangesetBadge
      mode="changed"
      moreInfo={<PropertyDiffTree parentId={parent.id} />}
    >
      {children}
    </ChangesetBadge>
  );
};

const PropertyDiffTree = (props: { parentId: string }) => {
  const { diff, doSomethingCool } = useContext(ChangesetDiffContext);

  // Get props that have changed in diff for id=parentId
  const changesForId = filter(
    diff.changed,
    (val) => val.previous.id === props.parentId
  )[0]; //only one item;

  console.log(changesForId);

  if (changesForId) {
    const out: Partial<Record<string, any>> = {};
    const propChanges = Object.entries(changesForId.previous).reduce(
      (acc, [maybePropKey, maybePropVal]) => {
        const prevVal = unwrapSecured(maybePropVal);
        const updatedVal = unwrapSecured(
          changesForId.updated[
            maybePropKey as keyof typeof changesForId.updated
          ]
        );
        if (
          prevVal !== updatedVal &&
          maybePropKey !== 'parent' &&
          maybePropKey !== 'id' &&
          maybePropKey !== '__typename' &&
          maybePropKey !== 'changeset'
        ) {
          acc[maybePropKey] = {
            previous: prevVal,
            updated: updatedVal,
          };
        }
        return acc;
      },
      out as Record<string, any>
    );
    return (
      <>
        {Object.entries(propChanges).map(([propKey, propVal]) => (
          <Typography key={propKey}>
            {`${changesForId.previous.__typename}: ${propKey}`}
            <PropertyDiff
              key={propKey}
              previous={propVal.previous ?? 0}
              current={propVal.updated ?? 0}
            />
          </Typography>
        ))}
      </>
    );
  }

  const childrenChanges = doSomethingCool(props.parentId);

  if (childrenChanges.current.length > 0) {
    return (
      <>
        {childrenChanges.previous.map((child, i) => (
          <PropertyDiffTree key={i} parentId={child.id} />
        ))}
      </>
    );
  } else {
    return <></>;
  }
};
