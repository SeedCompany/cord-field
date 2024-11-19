import { Nil } from '@seedcompany/common';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { CalendarDate } from '~/common';
import { makeQueryHandler } from '~/hooks';

const useQueryParams = makeQueryHandler({
  quarter: {
    encode: (q: CalendarDate | Nil) =>
      q ? q.plus({ quarter: 1 }).toFormat('yy-q') : undefined,
    decode: (input) => {
      const q = Array.isArray(input) ? input[0] : input;
      return q
        ? CalendarDate.fromFormat(q, 'yy-q').minus({ quarter: 1 })
        : undefined;
    },
  },
});

export const useQuarterState = () => {
  const [available] = useState(() => {
    const start = DateTime.local(2023, 7) as DateTime<true>;
    const end = DateTime.now().minus({ quarter: 1 });
    return start
      .until(end)
      .splitBy({ quarters: 1 })
      .map((i) => CalendarDate.fromDateTime(i.start!) as CalendarDate<true>)
      .reverse();
  });
  const [params, setParams] = useQueryParams();

  // Remove query param if invalid / out of range
  useEffect(() => {
    const { quarter } = params;
    if (!quarter) {
      return;
    }
    if (!quarter.isValid || !available.some((q) => q.equals(quarter))) {
      setParams({ quarter: undefined });
    }
  }, [params, setParams, available]);

  const current =
    (params.quarter?.isValid ? params.quarter : null) ?? available[0]!;

  const set = useCallback(
    (q: CalendarDate<true> | Nil) => {
      setParams({
        quarter: q && q !== available[0]! ? q : undefined,
      });
    },
    [available, setParams]
  );

  return { available, current, set };
};
