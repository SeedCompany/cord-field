import { useMutation } from '@apollo/client';
import { Tooltip, TooltipProps } from '@material-ui/core';
import * as React from 'react';
import { Except } from 'type-fest';
import { addItemToList, removeItemFromList } from '../../api';
import { ListIdentifier } from '../../api/list-caching/modifyList';
import { IconButton, IconButtonProps } from '../IconButton';
import { PushFlagIconFilled, PushFlagIconOutlined } from '../Icons';
import {
  ToggleFlagFragment,
  ToggleFlaggedDocument,
} from './ToggleFlagButton.generated';

export type ToggleFlagButtonProps = Except<IconButtonProps, 'children'> & {
  object?: ToggleFlagFragment;
  // A list to add/remove the object from this list when pin status changes
  listId?: ListIdentifier<any>;
  // Given this list identified by these input args,
  // should it be modified when this object's pin status changes
  listFilter?: (args: any) => boolean;
  label?: string;
  TooltipProps?: TooltipProps;
};

export const ToggleFlagButton = ({
  object,
  label,
  listId,
  listFilter,
  TooltipProps,
  ...rest
}: ToggleFlagButtonProps) => {
  const [toggleFlagged] = useMutation(ToggleFlaggedDocument, {
    update: (cache, result) => {
      if (!result.data || !object) {
        return;
      }
      console.log('Object: ', object);
      console.log('Flag: ', result.data.toggleFlagged);
      const flagged = result.data.toggleFlagged;

      // change current item
      cache.modify({
        id: cache.identify(object),
        fields: {
          flagged: () => flagged,
        },
      });

      // add/remove item from flagged list
      if (!listId) {
        return;
      }
      const modifier = flagged
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

  const button = (
    <IconButton
      color={object?.flagged ? 'secondary' : undefined}
      {...rest}
      onClick={(event) => {
        {
          console.log('objectButton: ', object);
        }
        if (!object) {
          return;
        }
        void toggleFlagged({
          variables: { id: object.id },
        });
        rest.onClick?.(event);
      }}
      disabled={rest.disabled || !object}
      loading={rest.loading || !object}
    >
      {object?.flagged ? <PushFlagIconFilled /> : <PushFlagIconOutlined />}
    </IconButton>
  );

  if (object && label) {
    return (
      <Tooltip
        {...TooltipProps}
        title={(object.flagged ? 'Unmark ' : 'Mark ') + label}
      >
        {button}
      </Tooltip>
    );
  }

  return button;
};
