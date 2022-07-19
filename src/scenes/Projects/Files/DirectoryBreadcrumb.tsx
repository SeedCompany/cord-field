import { fade, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useDrop } from 'react-dnd';
import { Breadcrumb, BreadcrumbProps } from '../../../components/Breadcrumb';
import { DndFileNode, DropOnDirResult } from './util';

type DirectoryBreadcrumbProps = BreadcrumbProps & {
  id?: string;
  name?: string;
};

const useStyles = makeStyles(({ palette, shape, spacing, transitions }) => ({
  root: {
    position: 'relative',
    margin: spacing(-1, -0.5),
    padding: spacing(1),
  },
  drop: {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    borderRadius: shape.borderRadius,
    transition: transitions.create('all'),
    border: `2px dashed transparent`,
  },
  isDragging: {
    borderColor: palette.divider,
  },
  isOver: {
    background: fade(palette.info.light, 0.7),
  },
}));

export const DirectoryBreadcrumb = ({
  id,
  name,
  ...props
}: DirectoryBreadcrumbProps) => {
  const [{ isOver, isDragging, canDrop }, dropRef] = useDrop(
    () => ({
      accept: DndFileNode,
      canDrop: () => !!id && !!name,
      drop: (): DropOnDirResult => ({ id: id!, name: name!, down: false }),
      collect: (monitor) => ({
        isDragging: monitor.getItem(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [id, name]
  );
  const classes = useStyles();
  return (
    <Breadcrumb
      {...props}
      ref={dropRef}
      className={clsx(classes.root, props.className)}
    >
      <span
        className={clsx({
          [classes.drop]: true,
          [classes.isOver]: isOver && canDrop,
          [classes.isDragging]: !!isDragging && canDrop,
        })}
      />
      {props.children || name}
    </Breadcrumb>
  );
};
