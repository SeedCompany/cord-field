import { makeStyles } from '@material-ui/core';
import { useDragLayer } from 'react-dnd';
import { NodeDragPreview } from './NodeDragPreview';
import { DndFileNode } from './util';

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
  },
}));

export const NodePreviewLayer = () => {
  const classes = useStyles();
  const { item, type, isDragging, offset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    type: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    offset: monitor.getClientOffset(),
  }));
  if (!isDragging || type !== DndFileNode || !offset) {
    return null;
  }
  return (
    <div className={classes.root}>
      <div
        style={{
          transform: `translate(${offset.x - 8}px, ${offset.y - 8}px)`,
        }}
      >
        <NodeDragPreview node={item} />
      </div>
    </div>
  );
};
