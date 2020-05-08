import React from 'react';
import { useFormState } from 'react-final-form';
import { Code } from '../Debug';

export const useFieldSpy = (name: string) => {
  const state = useFormState({
    subscription: {
      values: true,
      active: true,
      modified: true,
      visited: true,
      touched: true,
      dirtyFields: true,
      errors: true,
    },
  });
  return {
    value: state.values[name],
    active: state.active === name,
    modified: Boolean(state.modified?.[name]),
    visited: Boolean(state.visited?.[name]),
    touched: Boolean(state.touched?.[name]),
    dirty: Boolean(state.dirtyFields?.[name]),
    error: state.errors?.[name] ?? null,
  };
};

export const FieldSpy = ({ name }: { name: string }) => (
  <Code json={useFieldSpy(name)} />
);
