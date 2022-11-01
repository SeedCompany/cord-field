import { useMutation } from '@apollo/client';
import { Box } from '@mui/material';
import { useForkRef } from '@mui/material/utils';
import { GridRow, GridRowProps } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { addItemToList, removeItemFromList } from '~/api';
import { callAll } from '~/common';
import { MoveFileNodeDocument } from './MoveNode.graphql';
import {
  Directory,
  DndFileNode,
  DropOnDirResult,
  FileOrDirectory,
  isDirectory,
} from './util';

const isOverClass = 'is-hovering-over';

export const FileRow = ({
  parent,
  ...props
}: GridRowProps & { parent: Directory }) => {
  const node = props.row as FileOrDirectory;
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
    [props.row]
  );

  // Hide drag preview so we can use a custom one.
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const ref = useForkRef(dropRef, dragRef);

  return (
    <div ref={ref as any}>
      <Box
        className={isOver && !isDragging ? isOverClass : ''}
        component={GridRow}
        {...props}
        sx={[
          (theme) => ({
            '& > *': {
              transition: theme.transitions.create('all'),
            },
          }),
          isDragging && {
            background: 'background.default',
            '& > *': {
              opacity: 0,
            },
          },
          Boolean(draggingItem && !isDragging && canDrop) &&
            ((theme) => ({
              [`&.${isOverClass}`]: {
                background: theme.palette.info.light,
              },
            })),
          Boolean(draggingItem && !isDragging && !canDrop) &&
            ((theme) => ({
              opacity: 0.2,
              [`&.${isOverClass}`]: {
                background: theme.palette.error.light,
              },
            })),
        ]}
      ></Box>
    </div>
  );
};
