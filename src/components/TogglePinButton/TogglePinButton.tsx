import { useMutation } from '@apollo/client';
import { Tooltip, TooltipProps } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { Except } from 'type-fest';
import { addItemToList, ListIdentifier, removeItemFromList } from '~/api';
import { IconButton, IconButtonProps } from '../IconButton';
import { PushPinIconFilled, PushPinIconOutlined } from '../Icons';
import {
  TogglePinFragment,
  TogglePinnedDocument,
} from './TogglePinButton.graphql';

const useStyles = makeStyles<{ pinned: boolean }>()(
  ({ transitions }, { pinned }) => ({
    root: {
      transition: transitions.create('transform', {
        duration: transitions.duration.short,
      }),
      transform: pinned ? 'none' : 'rotate(45deg)',
    },
  })
);

export type TogglePinButtonProps = Except<IconButtonProps, 'children'> & {
  object?: TogglePinFragment;
  // A list to add/remove the object from this list when pin status changes
  listId?: ListIdentifier<any>;
  // Given this list identified by these input args,
  // should it be modified when this object's pin status changes
  listFilter?: (args: any) => boolean;
  label?: string;
  TooltipProps?: TooltipProps;
};

export const TogglePinButton = ({
  object,
  label,
  listId,
  listFilter,
  TooltipProps,
  ...rest
}: TogglePinButtonProps) => {
  const { classes, cx } = useStyles({ pinned: object?.pinned ?? false });

  const [togglePinned] = useMutation(TogglePinnedDocument, {
    update: (cache, result, options) => {
      if (!result.data || !object) {
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
      modifier(cache, result, options);
    },
  });

  const Icon = object?.pinned ? PushPinIconFilled : PushPinIconOutlined;

  const button = (
    <IconButton
      color={object?.pinned ? 'secondary' : undefined}
      {...rest}
      onClick={(event) => {
        if (!object) {
          return;
        }
        void togglePinned({
          variables: { id: object.id },
          optimisticResponse: {
            togglePinned: !object.pinned,
          },
        });
        rest.onClick?.(event);
      }}
      disabled={rest.disabled || !object}
      loading={rest.loading || !object}
      classes={{
        ...rest.classes,
        root: cx(classes.root, rest.classes?.root),
      }}
    >
      <Icon fontSize={rest.size ? 'inherit' : undefined} />
    </IconButton>
  );

  if (object && label) {
    return (
      <Tooltip
        {...TooltipProps}
        title={
          (object.pinned ? 'Unpin ' : 'Pin ') + label + ' (only affects you)'
        }
      >
        {button}
      </Tooltip>
    );
  }

  return button;
};
