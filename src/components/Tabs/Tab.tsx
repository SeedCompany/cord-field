import { Tab as BaseTab, TabProps, TabTypeMap } from '@mui/material';
import { styled } from '@mui/material/styles';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { Link, LinkProps } from 'react-router-dom';

export const Tab: typeof BaseTab = (props: TabTypeMap['props']) => (
  <BaseTab
    {...props}
    // Wrap string labels in span so we can scale them when selected (CSS in theme)
    label={
      typeof props.label === 'string' ? (
        <Span
          sx={{
            position: 'relative',
            fontSize: '1.25rem',
            lineHeight: 1,
          }}
        >
          {/* Hold invisible layout at an increased, selected scale */}
          <Span aira-hidden="true" sx={{ visibility: 'hidden' }}>
            {props.label}
          </Span>
          {/* Show text floating in the larger box */}
          <Span
            sx={(theme) => ({
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              transition: theme.transitions.create('transform'),
              transform: 'scale(.75)',
              '.Mui-selected &': {
                transform: 'scale(1)',
              },
            })}
          >
            {props.label}
          </Span>
        </Span>
      ) : (
        props.label
      )
    }
  />
);

const Span = styled('span')();

export const TabLink = (
  props: Omit<TabProps<'a'>, 'component'> & { selected?: boolean } & LinkProps
) => (
  <Tab component={Link} {...props} aria-current={props.selected && 'page'} />
);
