import React, { createContext, FC, useContext, useState } from 'react';

const initialPlanChangeContext = {
  planChangeId: '',
  setPlanChangeId: (_: string) => {
    return;
  },
};

export const PlanChangeContext = createContext<typeof initialPlanChangeContext>(
  initialPlanChangeContext
);
PlanChangeContext.displayName = 'PlanChangeContext';

export const PlanChangeProvider: FC = ({ children }) => {
  const [planChangeId, setPlanChangeId] = useState('');
  return (
    <PlanChangeContext.Provider value={{ planChangeId, setPlanChangeId }}>
      {children}
    </PlanChangeContext.Provider>
  );
};

export const usePlanChange = () => useContext(PlanChangeContext);
