import { noop } from 'lodash';
import * as React from 'react';
import { createContext, FC } from 'react';
import { Power } from '../../../api';
import { useDialog } from '../../../components/Dialog';
import { creates } from './Creates';

type OpenCreateFn = (type: Power) => void;

export const CreateItemContext = createContext<OpenCreateFn>(noop);

export const CreateDialogProviders: FC = (props) => {
  const [state, create, openedItem] = useDialog<Power>();

  return (
    <CreateItemContext.Provider value={create}>
      {props.children}
      {creates.map(([power, Dialog]) => (
        <Dialog
          {...state}
          key={power}
          open={state.open && openedItem === power}
        />
      ))}
    </CreateItemContext.Provider>
  );
};
