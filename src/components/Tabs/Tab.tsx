import { Tab as BaseTab, Box, TabProps, TabTypeMap } from '@mui/material';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { Link, LinkProps } from 'react-router-dom';

export const Tab: typeof BaseTab = (props: TabTypeMap['props']) => (
  <BaseTab
    {...props}
    // Wrap string labels in span so we can scale them when selected (CSS in theme)
    label={
      typeof props.label === 'string' ? (
        <Box
          component="span"
          sx={{ position: 'relative', display: 'inline-block' }}
        >
          {/* Hold invisible layout at an increased, selected scale */}
          <Box
            component="span"
            aira-hidden="true"
            sx={{
              visibility: 'hidden',
              lineHeight: 1,
              fontSize: 20,
            }}
          >
            {props.label}
          </Box>
          {/* Show text floating in the larger box */}
          <Box
            component="span"
            sx={(theme) => ({
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              transition: theme.transitions.create('transform'),
              '.Mui-selected &': {
                transform: 'scale(1.43)', // 20px
              },
            })}
          >
            {props.label}
          </Box>
        </Box>
      ) : (
        props.label
      )
    }
  />
);

export const TabLink = (
  props: Omit<TabProps<'a'>, 'component'> & { selected?: boolean } & LinkProps
) => (
  <Tab component={Link} {...props} aria-current={props.selected && 'page'} />
);
