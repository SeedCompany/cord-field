import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Switch,
  Typography,
} from '@mui/material';
import Markdown from 'markdown-to-jsx';
import { EarlyAccessFeature } from 'posthog-js';
import { useActiveFeatureFlags, usePostHog } from 'posthog-js/react';
import { Fragment, memo, useEffect, useState } from 'react';

export const EarlyAccessDialog = ({ children, ...props }: DialogProps) => (
  <Dialog {...props} aria-labelledby="ea-dialog-title" maxWidth="md">
    <DialogTitle id="ea-dialog-title">Early Access Features</DialogTitle>
    <DialogContent dividers sx={{ p: 0 }}>
      <EarlyAccessFeatures />
    </DialogContent>
    <DialogActions>
      <Button
        onClick={() => props.onClose?.({}, 'backdropClick')}
        variant="text"
        color="secondary"
      >
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

const EarlyAccessFeatures = () => {
  const postHog = usePostHog();

  const active = new Set(useActiveFeatureFlags());

  const toggle = (flag: string, next: boolean) => {
    postHog.updateEarlyAccessFeatureEnrollment(flag, next);
  };

  const [features, setFeatures] = useState<EarlyAccessFeature[]>([]);
  useEffect(() => {
    postHog.getEarlyAccessFeatures(setFeatures, true);
  }, [postHog, setFeatures]);

  return (
    <List>
      {features.map((feature) => {
        const flag = feature.flagKey!;
        const enabled = active.has(flag);
        return (
          <ListItem
            key={flag}
            divider
            sx={{
              px: 3,
              gap: 1,
              '&:last-of-type': { borderBottom: 'none' },
            }}
          >
            <ListItemText
              primary={feature.name}
              secondary={<Description>{feature.description}</Description>}
              secondaryTypographyProps={{ component: 'div' }}
              sx={{ whiteSpace: 'pre' }}
              id={`switch-list-label-${flag}`}
            />
            <Switch
              edge="end"
              onChange={() => toggle(flag, !enabled)}
              checked={enabled}
              inputProps={{
                'aria-labelledby': `switch-list-label-${flag}`,
              }}
            />
          </ListItem>
        );
      })}
      {features.length === 0 && (
        <Typography sx={{ px: 3, py: 1 }}>
          No early access features are currently available.
          <br /> Check back later!
        </Typography>
      )}
    </List>
  );
};

const Description = memo(function Description({
  children,
}: {
  children: string;
}) {
  return (
    <Markdown
      options={{
        wrapper: Fragment,
        overrides: {
          p: {
            component: Typography,
            props: { color: 'inherit' },
          },
        },
      }}
    >
      {children}
    </Markdown>
  );
});
