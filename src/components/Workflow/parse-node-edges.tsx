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

  const transitions = workflow.transitions.map(
    (t): Node<Transition, NodeTypes> => ({
      id: t.key,
      type: 'transition',
      data: t,
      position: { x: 0, y: 0 },
    })
  );
  const nodes = [...states, ...transitions];

  const edges = uniqBy(
    workflow.transitions
      .flatMap<Edge<Transition>>((t) => [
        ...t.from.map((from) => ({
          id: `${from.value} -> ${t.key}`,
          source: from.value,
          target: t.key,
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
              id: `${t.key} -> ${state.value}`,
              source: t.key,
              target: state.value,
              targetHandle: isBack(t) ? 'back' : 'forward',
              label: isBack(t) ? 'Back' : undefined,
              data: t,
            }))
          : [
              {
                id: `${t.key} -> ${t.to.state.value}`,
                source: t.key,
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

const isDynamic = isTypename<WorkflowTransitionDynamicTo>(
  'WorkflowTransitionDynamicTo'
);
