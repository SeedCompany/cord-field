import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import * as React from 'react';
import { useDialog } from './useDialog';

export default {
  title: 'Components/Dialog/useDialog',
};

export const Simple = () => {
  const [state, open] = useDialog();
  return (
    <>
      <Button color="primary" variant="contained" onClick={open}>
        Click Me!
      </Button>
      <Dialog {...state}>
        <DialogContent>
          <Typography>You clicked the button!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={state.onClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const DynamicItem = () => {
  const [state, open, name] = useDialog<string>();
  return (
    <>
      <Box display="flex">
        <List>
          {['Alice', 'Bob', 'Charlie'].map((item) => (
            <ListItem button onClick={() => open(item)}>
              <ListItemText>{item}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
      <Dialog {...state}>
        <DialogContent>
          <Typography>You clicked on {name}!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={state.onClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
