import { noop } from 'lodash';
import { createContext } from 'react';
import { Power } from '~/api/schema.graphql';
import { ChildrenProp } from '~/common';
import { useDialog } from '../../../components/Dialog';
import { creates } from './Creates';

type OpenCreateFn = (type: Power) => void;

export const CreateItemContext = createContext<OpenCreateFn>(noop);

export const CreateDialogProviders = (props: ChildrenProp) => {
  const [state, create, openedItem] = useDialog<Power>();

  const Dialog = openedItem && creates.get(openedItem)?.[0];

  return (
    <CreateItemContext.Provider value={create}>
      {props.children}
      {Dialog && <Dialog {...state} open={state.open} />}
    </CreateItemContext.Provider>
  );
};
