import { useMutation } from '@apollo/client';
import { IconButton, IconButtonProps } from '@material-ui/core';
import * as React from 'react';
import { Except } from 'type-fest';
import { PushPinIconFilled, PushPinIconOutlined } from '../Icons';
import {
  TogglePinFragment,
  TogglePinnedDocument,
} from './TogglePinButton.generated';

export type TogglePinButtonProps = Except<IconButtonProps, 'children'> & {
  object: TogglePinFragment;
};

export const TogglePinButton = ({ object, ...rest }: TogglePinButtonProps) => {
  const [togglePinned] = useMutation(TogglePinnedDocument, {
    variables: {
      id: object.id,
    },
    update: (cache, result) => {
      if (!result.data) {
        return;
      }
      cache.modify({
        id: cache.identify(object),
        fields: {
          pinned: () => result.data?.togglePinned,
        },
      });
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
