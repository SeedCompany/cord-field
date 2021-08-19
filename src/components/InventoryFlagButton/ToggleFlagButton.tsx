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
  readOnly?: boolean;
  TooltipProps?: TooltipProps;
};

export const ToggleFlagButton = ({
  object,
  label,
  listId,
  listFilter,
  TooltipProps,
  readOnly,
  ...rest
}: ToggleFlagButtonProps) => {
  const [toggleFlagged] = useMutation(ToggleFlaggedDocument, {
    update: (cache, result) => {
      if (!result.data || !object) {
        return;
      }
      const approvedInventory = result.data.toggleFlagged;

      // change current item
      cache.modify({
        id: cache.identify(object),
        fields: {
          approvedInventory: () => approvedInventory,
        },
      });

      // add/remove item from flagged list
      if (!listId) {
        return;
      }
      const modifier = approvedInventory
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
  const button = !readOnly ? (
    <IconButton
      style={{ cursor: 'pointer' }}
      color={object?.approvedInventory ? 'secondary' : 'primary'}
      {...rest}
      onClick={(event) => {
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
      {object?.approvedInventory ? (
        <PushFlagIconFilled />
      ) : (
        <PushFlagIconOutlined />
      )}
    </IconButton>
  ) : (
    <IconButton
      style={{ cursor: 'default' }}
      color={object?.approvedInventory ? 'secondary' : 'primary'}
      {...rest}
      disabled={rest.disabled || !object}
      loading={rest.loading || !object}
    >
      {object?.approvedInventory ? (
        <PushFlagIconFilled />
      ) : (
        <PushFlagIconOutlined />
      )}
    </IconButton>
  );

  if (object && label) {
    return (
      <Tooltip
        {...TooltipProps}
        title={
          !readOnly
            ? (object.approvedInventory ? 'Unmark ' : 'Mark ') + label
            : ''
        }
      >
        {button}
      </Tooltip>
    );
  }

  return object ? button : <PushFlagIconOutlined />;
};
