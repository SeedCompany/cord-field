import React, { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { Code } from '../Debug';

export const useFieldSpy = (name: string) => {
  const form = useForm();
  const [registered, setRegistered] = useState(true);
  useEffect(() => {
    setRegistered(form.getRegisteredFields().includes(name));
  }, [form, name]);
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
    registered,
    value: state.values[name],
    active: state.active === name,
    modified: Boolean(state.modified?.[name]),
    visited: Boolean(state.visited?.[name]),
    touched: Boolean(state.touched?.[name]),
    dirty: Boolean(state.dirtyFields?.[name]),
    error: state.errors?.[name] ?? null,
  };
};

export const FieldSpy = ({ name }: { name: string }) => {
  const { registered, ...rest } = useFieldSpy(name);
  if (!registered) {
    return <Code>Field "{name}" not registered</Code>;
  }
  return <Code json={rest} />;
};
