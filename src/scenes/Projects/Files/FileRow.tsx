import { useMutation } from '@apollo/client';
import { useForkRef } from '@mui/material/utils';
import { GridRow, GridRowProps } from '@mui/x-data-grid-pro';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { makeStyles } from 'tss-react/mui';
import { addItemToList, removeItemFromList } from '~/api';
import { callAll } from '~/common';
import { MoveFileNodeDocument } from './MoveNode.graphql';
import { DndFileNode, DropOnDirResult, FileRowData, isDirectory } from './util';

const useStyles = makeStyles<void, 'isOver'>()(
  ({ palette, transitions }, _props, classes) => ({
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
      [`&.${classes.isOver}`]: {
        background: palette.info.light,
      },
    },
    rejectsDrop: {
      opacity: 0.2,
      [`&.${classes.isOver}`]: {
        background: palette.error.light,
      },
    },
  })
);

export const FileRow = (props: GridRowProps) => {
  const node = props.row as FileRowData;
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
    [props.row]
  );
  const { enqueueSnackbar } = useSnackbar();
  const [moveNode] = useMutation(MoveFileNodeDocument);
  const [{ isDragging }, dragRef, preview] = useDrag(
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
              listId: [node.parent, 'children'],
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
    [props.row]
  );

  // Hide drag preview so we can use a custom one.
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const ref = useForkRef(dropRef, dragRef);
  const { classes, cx } = useStyles();

  return (
    <div ref={ref as any}>
      <GridRow
        {...props}
        className={cx({
          [classes.root]: true,
          [classes.isDragging]: isDragging,
          [classes.acceptsDrop]: Boolean(
            draggingItem && !isDragging && canDrop
          ),
          [classes.rejectsDrop]: Boolean(
            draggingItem && !isDragging && !canDrop
          ),
          [classes.isOver]: isOver && !isDragging,
        })}
      />
    </div>
  );
};
