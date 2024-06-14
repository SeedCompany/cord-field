import { useToggle } from 'ahooks';
import { Dispatch, useCallback, useEffect, useRef } from 'react';
import { Node, useReactFlow, useStoreApi } from 'reactflow';
import { Sx } from '~/common';
import { determinePositions } from './layout';
import { useHighlightedState } from './useHighlightedState';
import {
  WorkflowStateFragment as State,
  WorkflowTransitionFragment as Transition,
} from './workflow.graphql';

export const useAutoLayout = (setNodes: Dispatch<Node[]>) => {
  const highlightedState = useHighlightedState();
  const store = useStoreApi();
  const api = useReactFlow<State | Transition>();
  const autoLayoutStage = useRef(0);
  const [show, setShow] = useToggle();

  const reset = useCallback(() => {
    autoLayoutStage.current = 0;
  }, []);

  useEffect(
    () =>
      store.subscribe((state) => {
        if (autoLayoutStage.current === 0) {
          const nodes = state.getNodes();
          if (nodes[0]?.width) {
            // console.log('nodes have sized, positioning');
            autoLayoutStage.current++;
            const positioned = determinePositions(nodes, state.edges);
            setNodes(positioned);
          }
          return;
        }

        if (autoLayoutStage.current === 1) {
          // console.log('nodes have positioned, adjusting view port');
          autoLayoutStage.current++;
          window.requestAnimationFrame(() => api.fitView());
          return;
        }

        if (autoLayoutStage.current === 2) {
          // console.log('viewport adjusted, showing');
          autoLayoutStage.current++;
          setShow.setRight();
        }

        if (autoLayoutStage.current === 3) {
          // console.log('highlighting current state');
          autoLayoutStage.current++;
          if (!highlightedState) {
            return;
          }
          const node = state
            .getNodes()
            .find(
              (n) =>
                n.data.__typename === 'WorkflowState' &&
                n.data.value === highlightedState
            );
          if (!node) {
            console.warn('Could not find node to highlight');
            return;
          }
          window.requestAnimationFrame(() => {
            api.setCenter(node.position.x, node.position.y, {
              zoom: 0.8,
              duration: 1000,
            });
          });
        }
      }),
    [store, api, autoLayoutStage, setShow, setNodes, highlightedState]
  );

  return {
    show,
    showSx: !show ? showSx : undefined,
    reset,
  };
};

const showSx: Sx = { '.react-flow__renderer': { opacity: 0 } };
