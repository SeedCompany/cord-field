import { useMutation } from '@apollo/client';
import { IconButton, IconButtonProps } from '@material-ui/core';
import * as React from 'react';
import { Except } from 'type-fest';
import { addItemToList, removeItemFromList } from '../../api';
import { ListIdentifier } from '../../api/list-caching/modifyList';
import { PushPinIconFilled, PushPinIconOutlined } from '../Icons';
import {
  TogglePinFragment,
  TogglePinnedDocument,
} from './TogglePinButton.generated';

export type TogglePinButtonProps = Except<IconButtonProps, 'children'> & {
  object: TogglePinFragment;
  // A list to add/remove the object from this list when pin status changes
  listId?: ListIdentifier<any>;
  // Given this list identified by these input args,
  // should it be modified when this object's pin status changes
  listFilter?: (args: any) => boolean;
};

export const TogglePinButton = ({
  object,
  listId,
  listFilter,
  ...rest
}: TogglePinButtonProps) => {
  const [togglePinned] = useMutation(TogglePinnedDocument, {
    variables: {
      id: object.id,
    },
    update: (cache, result) => {
      if (!result.data) {
        return;
      }
      const pinned = result.data.togglePinned;

      // change current item
      cache.modify({
        id: cache.identify(object),
        fields: {
          pinned: () => pinned,
        },
      });

      // add/remove item from pinned list
      if (!listId) {
        return;
      }
      const modifier = pinned
        ? addItemToList({
            listId,
            filter: listFilter,
            outputToItem: () => object,
          })
        : removeItemFromList({
            listId,
            filter: listFilter,
            item: object,
          });
      modifier(cache, result);
    },
  });

  return (
    <IconButton
      color="secondary"
      {...rest}
      onClick={(event) => {
        void togglePinned();
        rest.onClick?.(event);
      }}
    >
      {object.pinned ? <PushPinIconFilled /> : <PushPinIconOutlined />}
    </IconButton>
  );
};
