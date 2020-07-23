import { useEffect, useRef } from 'react';
import { useFormState } from 'react-final-form';
import { ScriptureRangeInput } from '../../../api';

export const initialAccordionState = {
  selectedBook: '',
  selectedScriptureRanges: [],
  show: { product: true, mediums: false },
  expand: { product: true, mediums: false },
};

export const accordionStateReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'EXPAND_ONE':
      return {
        ...state,
        expand: expandOne(state.expand, action.section),
      };
    case 'EXPAND':
      return {
        ...state,
        expand: {
          ...state.expand,
          [action.section]: true,
        },
      };
    case 'COLLAPSE':
      return {
        ...state,
        expand: {
          ...state.expand,
          [action.section]: false,
        },
      };
    case 'SHOW':
      return {
        ...state,
        show: {
          ...state.show,
          [action.section]: true,
        },
      };
    case 'SELECT_BOOK':
      return {
        ...state,
        selectedBook: action.book,
      };
    case 'ADD_SCRIPTURE_RANGE':
      return {
        ...state,
        selectedScriptureRanges: [
          ...state.selectedScriptureRanges,
          action.scriptureRange,
        ],
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
  type: 'EXPAND',
  section,
});

export const collapseSection = (section: string) => ({
  type: 'COLLAPSE',
  section,
});

export const selectBook = (book: string) => ({
  type: 'SELECT_BOOK',
  book,
});

export const addScriptureRange = (scriptureRange: ScriptureRangeInput) => ({
  type: 'ADD_SCRIPTURE_RANGE',
  scriptureRange,
});

export const AccordionState = ({ dispatch }: any) => {
  const currentFormState = useFormState();
  console.log('currentFormState: ', currentFormState);
  const prevFormState = useRef(currentFormState);

  useEffect(() => {
    if (
      !prevFormState.current.dirtyFields.productType &&
      currentFormState.dirtyFields.productType
    ) {
      if (currentFormState.values.productType?.[0] === 'scripture') {
        dispatch(showSection('scriptureReferences'));
        dispatch(expandSection('scriptureReferences'));
      } else {
        dispatch(showSection('produces'));
        dispatch(expandSection('produces'));
      }
    }

    if (
      !prevFormState.current.dirtyFields.produces &&
      currentFormState.dirtyFields.produces
    ) {
      dispatch(collapseSection('product'));
      dispatch(showSection('scriptureReferences'));
      dispatch(expandSection('scriptureReferences'));
    }

    if (
      prevFormState.current.values.scriptureReferences?.[0] !==
      currentFormState.values.scriptureReferences?.[0]
    ) {
      dispatch(
        selectBook(currentFormState.values.scriptureReferences?.[0] || '')
      );
    }

    if (
      !prevFormState.current.dirtyFields.scriptureReferences &&
      currentFormState.dirtyFields.scriptureReferences
    ) {
      dispatch(collapseSection('product'));
      dispatch(collapseSection('produces'));
      dispatch(showSection('mediums'));
      dispatch(expandSection('mediums'));
    }

    if (
      !prevFormState.current.dirtyFields.mediums &&
      currentFormState.dirtyFields.mediums
    ) {
      dispatch(collapseSection('scriptureReferences'));
      dispatch(showSection('purposes'));
      dispatch(expandSection('purposes'));
    }

    if (
      !prevFormState.current.dirtyFields.purposes &&
      currentFormState.dirtyFields.purposes
    ) {
      dispatch(collapseSection('mediums'));
      dispatch(showSection('methodology'));
      dispatch(expandSection('methodology'));
    }

    if (
      !prevFormState.current.dirtyFields.methodology &&
      currentFormState.dirtyFields.methodology
    ) {
      dispatch(collapseSection('purposes'));
    }
    //update previous state
    prevFormState.current = currentFormState;
  }, [currentFormState, dispatch]);

  return null;
};
