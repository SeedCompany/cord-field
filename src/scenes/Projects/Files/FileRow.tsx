import { useMutation } from '@apollo/client';
import { makeStyles, useForkRef } from '@material-ui/core';
import clsx from 'clsx';
import { MTableBodyRow } from 'material-table';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { addItemToList, removeItemFromList } from '../../../api';
import { callAll } from '../../../util';
import { MoveFileNodeDocument } from './MoveNode.generated';
import {
  Directory,
  DndFileNode,
  DropOnDirResult,
  FileOrDirectory,
  isDirectory,
} from './util';

const useStyles = makeStyles(({ palette, transitions }) => ({
  root: {
    '& > *': {
      transition: transitions.create('all'),
    },
  },
  isDragging: {
    background: palette.background.default,
    '& > *': {
      opacity: 0,
    },
  },
  isOver: {},
  acceptsDrop: {
    '&$isOver': {
      background: palette.info.light,
    },
  },
  rejectsDrop: {
    opacity: 0.2,
    '&$isOver': {
      background: palette.error.light,
    },
  },
}));

export const FileRow = (props: any) => {
  const parent = props.data.parent as Directory;
  const node = props.data.item as FileOrDirectory;
  const [{ isOver, canDrop, draggingItem }, dropRef] = useDrop(
    () => ({
      accept: DndFileNode,
      canDrop: (item) => isDirectory(node) && item !== node,
      drop: (): DropOnDirResult => ({ ...node, down: true }),
      collect: (monitor) => ({
        draggingItem: monitor.getItem(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [props.data]
  );
  const { enqueueSnackbar } = useSnackbar();
  const [moveNode] = useMutation(MoveFileNodeDocument);
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: DndFileNode,
      item: node,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (node, monitor) => {
        const res = monitor.getDropResult<DropOnDirResult>();
        if (!res) {
          return;
        }
        enqueueSnackbar(
          `Moving ${node.name} ${res.down ? 'into' : 'up to'} ${res.name}`,
          {
            variant: 'info',
          }
        );
        void moveNode({
          variables: {
            input: {
              id: node.id,
              parentId: res.id,
            },
          },
          update: callAll(
            removeItemFromList({
              listId: [parent, 'children'],
              item: node,
            }),
            addItemToList({
              listId: [{ __typename: 'Directory', id: res.id }, 'children'],
              outputToItem: () => node,
            })
          ),
        });
      },
    }),
    [props.data]
  );

  const ref = useForkRef(dropRef, dragRef);
  const classes = useStyles();

  return (
    <MTableBodyRow
      {...props}
      innerRef={ref}
      className={clsx({
        [props.className ?? '']: true,
        [classes.root]: true,
        [classes.isDragging]: isDragging,
        [classes.acceptsDrop]: draggingItem && !isDragging && canDrop,
        [classes.rejectsDrop]: draggingItem && !isDragging && !canDrop,
        [classes.isOver]: isOver && !isDragging,
      })}
    />
  );
};
