import { useMutation } from '@apollo/client';
import { IconButton, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { FC, useCallback } from 'react';
import * as React from 'react';
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

export interface TogglePinButtonProps {
  object: TogglePinFragment;
  className?: string;
}

export const TogglePinButton: FC<TogglePinButtonProps> = ({
  object,
  className,
}) => {
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

  const handlePin = useCallback(
    async (evt: React.MouseEvent<HTMLButtonElement>) => {
      evt.preventDefault();
      await togglePinned();
    },
    [togglePinned]
  );

  return (
    <IconButton
      onClick={handlePin}
      className={clsx(classes.pinIcon, className)}
    >
      {object.pinned ? <PushPinIconFilled /> : <PushPinIconOutlined />}
    </IconButton>
  );
};
