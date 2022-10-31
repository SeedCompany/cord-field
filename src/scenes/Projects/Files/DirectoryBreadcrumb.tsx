import { Box } from '@mui/material';
import { alpha as fade } from '@mui/material/styles';
import { useDrop } from 'react-dnd';
import { Breadcrumb, BreadcrumbProps } from '../../../components/Breadcrumb';
import { DndFileNode, DropOnDirResult } from './util';

type DirectoryBreadcrumbProps = BreadcrumbProps & {
  id?: string;
  name?: string;
};
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
  return (
    <Breadcrumb
      {...props}
      ref={dropRef}
      className={props.className}
      sx={{
        position: 'relative',
        my: -1,
        mx: -0.5,
        p: 1,
      }}
    >
      <Box
        component="span"
        sx={[
          (theme) => {
            return {
              position: 'absolute',
              inset: 0,
              zIndex: -1,
              borderRadius: `${theme.shape.borderRadius}px`,
              transition: theme.transitions.create('all'),
              border: `2px dashed transparent`,
            };
          },
          Boolean(isOver && canDrop) &&
            ((theme) => ({
              background: fade(theme.palette.info.light, 0.7),
            })),
          Boolean(isDragging && canDrop) && {
            borderColor: 'divider',
          },
        ]}
      />
      {props.children || name}
    </Breadcrumb>
  );
};
