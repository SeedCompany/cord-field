import { useMutation } from '@apollo/client';
import { SvgIcon, Tooltip, TooltipProps } from '@mui/material';
import { Except } from 'type-fest';
import { addItemToList, ListIdentifier, removeItemFromList } from '~/api';
import { IconButton, IconButtonProps } from '../IconButton';
import {
  TogglePinFragment,
  TogglePinnedDocument,
} from './TogglePinButton.graphql';

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
    >
      <SvgIcon
        viewBox="0 0 24 24"
        fontSize={rest.size ? 'inherit' : undefined}
        css={[
          (theme) => ({
            transition: theme.transitions.create('all', {
              duration: theme.transitions.duration.short,
            }),
          }),
          object?.pinned ? undefined : { transform: 'rotate(45deg)' },
        ]}
      >
        {object?.pinned ? (
          <path d="M16,9V4l1,0c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H7C6.45,2,6,2.45,6,3v0 c0,0.55,0.45,1,1,1l1,0v5c0,1.66-1.34,3-3,3h0v2h5.97v7l1,1l1-1v-7H19v-2h0C17.34,12,16,10.66,16,9z" />
        ) : (
          <path d="M14,4v5c0,1.12,0.37,2.16,1,3H9c0.65-0.86,1-1.9,1-3V4H14 M17,2H7C6.45,2,6,2.45,6,3c0,0.55,0.45,1,1,1c0,0,0,0,0,0l1,0v5 c0,1.66-1.34,3-3,3v2h5.97v7l1,1l1-1v-7H19v-2c0,0,0,0,0,0c-1.66,0-3-1.34-3-3V4l1,0c0,0,0,0,0,0c0.55,0,1-0.45,1-1 C18,2.45,17.55,2,17,2L17,2z" />
        )}
      </SvgIcon>
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
