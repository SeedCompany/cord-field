import { Paper, PaperProps } from '@material-ui/core';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useWindowSize } from 'react-use';

const initialPosition = { x: null as null | number, y: null as null | number };

export const DraggablePaper = ({
  ...props
}: PaperProps & { isCollapsed: boolean }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const paperRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(initialPosition);
  const { isCollapsed, ...rest } = props;

  const calculateMargin = (
    element: HTMLDivElement | null,
    side: 'Top' | 'Bottom' | 'Left' | 'Right'
  ): number => {
    const style = element?.style ?? {
      marginTop: '0px',
      marginBottom: '0px',
      marginLeft: '0px',
      marginRight: '0px',
    };
    const property = `margin${side}` as const;
    return Number(style[property].split('px')[0]);
  };

  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const managerSize = {
    width:
      (paperRef.current?.offsetWidth ?? 0) +
      calculateMargin(paperRef.current, 'Left') +
      calculateMargin(paperRef.current, 'Right'),
    height:
      (paperRef.current?.offsetHeight ?? 0) +
      calculateMargin(paperRef.current, 'Top') +
      calculateMargin(paperRef.current, 'Bottom'),
  };
  const collapsedPosition = {
    x: windowWidth - managerSize.width,
    y: windowHeight - managerSize.height,
  };

  const calculatePosition = useCallback(() => {
    const x =
      positionRef.current.x ??
      windowWidth -
        (paperRef.current?.offsetWidth ?? 0) -
        calculateMargin(paperRef.current, 'Left') -
        calculateMargin(paperRef.current, 'Right');
    const y =
      positionRef.current.y ??
      windowHeight -
        (paperRef.current?.offsetHeight ?? 0) -
        calculateMargin(paperRef.current, 'Top') -
        calculateMargin(paperRef.current, 'Bottom');
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
      <Paper ref={paperRef} style={{ margin: 24 }} {...rest} />
    </Draggable>
  );
};
