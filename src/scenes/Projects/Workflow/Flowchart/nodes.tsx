import { Box, Card, CardProps, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { forwardRef, Fragment } from 'react';
import { BezierEdge, EdgeProps, Handle, NodeProps, Position } from 'reactflow';
import { extendSx } from '~/common';
import { transitionTypeStyles } from '~/common/transitionTypeStyles';
import { isBack } from './parse-node-edges';
import {
  WorkflowStateFragment as State,
  WorkflowTransitionFragment as Transition,
} from './workflow.graphql';

import 'reactflow/dist/style.css';

export const FlowchartStyles = styled(Box)(({ theme }) => ({
  height: '100%',
  '.react-flow__attribution': { display: 'none' },
  '& .react-flow': {
    '.react-flow__edge-textbg': {
      fill: theme.palette.background.paper,
    },
    '.react-flow__handle': {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      background: 'transparent',
      border: 'none',
    },
    '.react-flow__edge': {
      '.react-flow__edge-path, .react-flow__connection-path': {
        stroke: 'var(--color)',
        strokeWidth: 2,
      },
      '&.selected, &:focus, &:focus-visible': {
        '.react-flow__edge-path': {
          strokeWidth: 3,
        },
      },
    },
  },
}));

export function StateNode({ data, selected }: NodeProps<State>) {
  return (
    <>
      <Handle id="forward" type="target" position={Position.Top} />
      <NodeCard selected={selected} color="info">
        {data.label}
      </NodeCard>
      <Handle
        id="back"
        type="target"
        position={Position.Left}
        // style={{ left: '25%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        // style={{ left: '75%' }}
      />
    </>
  );
}

export function TransitionNode({ data, selected }: NodeProps<Transition>) {
  const { color } = transitionTypeStyles[data.type];
  const back = isBack(data);
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Tooltip title={<Notifiers {...data} />}>
        <NodeCard
          selected={selected}
          color={color}
          sx={{
            borderRadius: 6,
            py: 1,
            px: 2,
            fontSize: 'small',
          }}
        >
          {data.label}
        </NodeCard>
      </Tooltip>
      <Handle type="source" position={back ? Position.Left : Position.Bottom} />
    </>
  );
}

const NodeCard = forwardRef<
  HTMLDivElement,
  CardProps & Pick<NodeProps, 'selected'>
>(function NodeCard({ children, selected, color, sx, ...rest }, ref) {
  return (
    <Card
      {...rest}
      ref={ref}
      elevation={selected ? 4 : 1}
      sx={[
        (theme) => ({
          transition: theme.transitions.create(['box-shadow', 'border-color'], {
            duration: theme.transitions.duration.shorter,
          }),
          borderColor: selected ? `${color}.dark` : 'transparent',
          borderWidth: 1,
          borderStyle: 'solid',
          p: 2,
          bgcolor: `${color}.main`,
          color: `${color}.contrastText`,
        }),
        ...extendSx(sx),
      ]}
    >
      {children}
    </Card>
  );
});

const Notifiers = (t: Transition) => (
  <>
    Notifiers: <br />
    {t.notifiers.map((n) => (
      <Fragment key={n.label}>
        - {n.label}
        <br />
      </Fragment>
    ))}
  </>
);

export const Edge = (props: EdgeProps<Transition>) => {
  const { color } = transitionTypeStyles[props.data!.type];
  return (
    <Box
      component="g"
      sx={(theme) => ({ '--color': theme.palette[color].light })}
    >
      <BezierEdge {...props} />
    </Box>
  );
};
