import { useMutation } from '@apollo/client';
import { IconButton, IconButtonProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import * as React from 'react';
import { Except } from 'type-fest';
import { PushPinIconFilled, PushPinIconOutlined } from '../Icons';
import {
  TogglePinFragment,
  TogglePinnedDocument,
} from './TogglePinButton.generated';

const useStyles = makeStyles(() => {
  return {
    pinIcon: {
      padding: 10,
    },
  };
});

export type TogglePinButtonProps = Except<IconButtonProps, 'children'> & {
  object: TogglePinFragment;
};

export const TogglePinButton = ({
  object,
  className,
  ...rest
}: TogglePinButtonProps) => {
  const classes = useStyles();
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
      className={clsx(classes.pinIcon, className)}
    >
      {object.pinned ? <PushPinIconFilled /> : <PushPinIconOutlined />}
    </IconButton>
  );
};
