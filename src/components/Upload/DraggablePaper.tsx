import { Paper, PaperProps } from '@material-ui/core';
import React, {
  FC,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useWindowSize } from 'react-use';

const initialPosition = { x: null as null | number, y: null as null | number };

export const DraggablePaper: FC<PaperProps & { isCollapsed: boolean }> = ({
  ...props
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const paperRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(initialPosition);
  const { isCollapsed, ...rest } = props;

  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const managerSize = {
    width: (paperRef.current?.offsetWidth ?? 0) + 24,
    height: (paperRef.current?.offsetHeight ?? 0) + 24,
  };
  const collapsedPosition = {
    x: windowWidth - managerSize.width,
    y: windowHeight - managerSize.height,
  };

  const calculatePosition = useCallback(() => {
    const x =
      positionRef.current.x ??
      windowWidth - (paperRef.current?.offsetWidth ?? 0) - 24;
    const y =
      positionRef.current.y ??
      windowHeight - (paperRef.current?.offsetHeight ?? 0) - 24;
    return { x, y };
  }, [windowWidth, windowHeight, paperRef, positionRef]);

  useLayoutEffect(() => {
    const { x, y } = calculatePosition();
    setPosition({ x, y });
  }, [calculatePosition, setPosition]);

  function handleDrag() {
    setIsDragging(true);
  }

  function handleDragStop(_: DraggableEvent, data: DraggableData) {
    const wasDragging = isDragging;
    setIsDragging(false);
    if (wasDragging) {
      const { x, y } = data;
      positionRef.current.x = x;
      positionRef.current.y = y;
      setPosition({ x, y });
    }
  }

  return (
    <Draggable
      bounds="parent"
      cancel="#upload-manager-collapse-button, #upload-manager-close-button"
      disabled={isCollapsed}
      handle="#draggable-dialog-title"
      onDrag={handleDrag}
      onStop={handleDragStop}
      position={isCollapsed ? collapsedPosition : position}
    >
      <Paper ref={paperRef} {...rest} />
    </Draggable>
  );
};
