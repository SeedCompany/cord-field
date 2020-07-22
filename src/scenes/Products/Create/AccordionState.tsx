import { useEffect, useRef } from 'react';
import { useFormState } from 'react-final-form';

export const initialAccordionState = {
  show: { product: true, medium: false },
  expand: { product: true, medium: false },
};

export const accordionStateReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'EXPAND_ONE':
      console.log('EXPAND_ONEtriggered: ');
      return {
        ...state,
        expand: expandOne(state.expand, action.section),
      };
    case 'SHOW':
      return {
        ...state,
        show: {
          ...state.show,
          [action.section]: true,
        },
      };
    default:
      throw new Error();
  }
};

const expandOne = (expandState: any, section: any) =>
  Object.keys(expandState).reduce((prev: any, current: any) => {
    return current === section
      ? { ...prev, [current]: true }
      : { ...prev, [current]: false };
  }, {});

export const showSection = (section: string) => ({
  type: 'SHOW',
  section,
});

export const expandSection = (section: string) => ({
  type: 'EXPAND_ONE',
  section,
});

export const AccordionState = ({ dispatch }: any) => {
  const currentFormState = useFormState();
  const prevFormState = useRef(currentFormState);

  useEffect(() => {
    if (
      !prevFormState.current.dirtyFields.product &&
      currentFormState.dirtyFields.product
    ) {
      dispatch(showSection('medium'));
      dispatch(expandSection('medium'));
    }
    //update previous state
    prevFormState.current = currentFormState;
  }, [currentFormState, dispatch]);

  return null;
};
