import { useToggle } from 'ahooks';
import { Dispatch, useCallback, useEffect, useRef } from 'react';
import { Node, useReactFlow, useStoreApi } from 'reactflow';
import { Sx } from '~/common';
import { determinePositions } from './layout';

export const useAutoLayout = (setNodes: Dispatch<Node[]>) => {
  const api = useStoreApi();
  const { fitView, getNodes, getEdges } = useReactFlow();
  const autoLayoutStage = useRef(0);
  const [show, setShow] = useToggle();

  const reset = useCallback(() => {
    autoLayoutStage.current = 0;
  }, []);

  useEffect(
    () =>
      api.subscribe((state) => {
        if (autoLayoutStage.current === 0 && state.getNodes()[0]?.width) {
          // console.log('nodes have sized, positioning');
          autoLayoutStage.current = 1;
          const positioned = determinePositions(getNodes(), getEdges());
          setNodes(positioned);
          return;
        }

        if (autoLayoutStage.current === 1) {
          // console.log('nodes have positioned, adjusting view port');
          autoLayoutStage.current = 2;
          window.requestAnimationFrame(() => fitView());
          return;
        }

        if (autoLayoutStage.current === 2) {
          // console.log('viewport adjusted, showing');
          autoLayoutStage.current = 3;
          setShow.setRight();
        }
      }),
    [fitView, api, autoLayoutStage, setShow, getNodes, getEdges, setNodes]
  );

  return {
    show,
    showSx: !show ? showSx : undefined,
    reset,
  };
};

const showSx: Sx = { '.react-flow__renderer': { opacity: 0 } };
