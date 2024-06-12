import { cmpBy } from '@seedcompany/common';
import { uniqBy } from 'lodash';
import { Fragment } from 'react';
import { Edge, Node } from 'reactflow';
import { LiteralUnion } from 'type-fest';
import { WorkflowTransitionDynamicTo } from '~/api/schema/schema.graphql';
import { isTypename } from '~/common';
import {
  WorkflowStateFragment as State,
  WorkflowTransitionFragment as Transition,
  WorkflowFragment as Workflow,
} from './workflow.graphql';

export type NodeTypes = LiteralUnion<'state' | 'transition', string>;

export function parseWorkflow(workflow: Workflow) {
  const states = workflow.states.map(
    (state): Node<State, NodeTypes> => ({
      id: state.value,
      type: 'state',
      data: state,
      position: { x: 0, y: 0 },
    })
  );

  const transitionEnds = uniqBy(
    workflow.transitions.toSorted(
      cmpBy((t) => {
        const endState =
          t.to.__typename === 'WorkflowTransitionStaticTo'
            ? t.to.state.value
            : t.to.relatedStates[0]!.value;
        return workflow.states.findIndex((e) => e.value === endState);
      })
    ),
    transitionEndId
  );
  const transitionEndNodes = transitionEnds.map(
    (t): Node<Transition, NodeTypes> => ({
      id: transitionEndId(t),
      type: 'transition',
      data: t,
      position: { x: 0, y: 0 },
    })
  );
  const nodes = [...states, ...transitionEndNodes].reverse();

  const edges = uniqBy(
    workflow.transitions
      .flatMap<Edge<Transition>>((t) => [
        ...t.from.map((from) => ({
          id: `${from.value} -> ${transitionEndId(t)}`,
          source: from.value,
          target: transitionEndId(t),
          targetHandle: 'forward',
          label: (
            <>
              {t.conditions.map((c) => (
                <Fragment key={c.label}>
                  {c.label}
                  <br />
                </Fragment>
              ))}
            </>
          ),
          data: t,
        })),
        ...(isDynamic(t.to)
          ? t.to.relatedStates.map((state) => ({
              id: `${transitionEndId(t)} -> ${state.value}`,
              source: transitionEndId(t),
              target: state.value,
              targetHandle: isBack(t) ? 'back' : 'forward',
              label: isBack(t) ? 'Back' : undefined,
              data: t,
            }))
          : [
              {
                id: `${transitionEndId(t)} -> ${t.to.state.value}`,
                source: transitionEndId(t),
                target: t.to.state.value,
                targetHandle: 'forward',
                data: t,
              },
            ]),
      ])
      .map((e) => ({
        ...e,
        animated: e.animated ?? true,
      })),
    (e) => e.id
  );

  return { nodes, edges };
}

export const isBack = (t: Transition) =>
  isDynamic(t.to) && t.to.label === 'Back';

const transitionEndId = (t: Transition) => {
  const endId =
    t.to.__typename === 'WorkflowTransitionStaticTo'
      ? t.to.state.value
      : t.to.id;
  return `${t.label} -> ${endId}`;
};
const isDynamic = isTypename<WorkflowTransitionDynamicTo>(
  'WorkflowTransitionDynamicTo'
);
