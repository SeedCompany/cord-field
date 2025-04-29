import { ReactElement } from 'react';
import { DateTimeOrISO, Nullable } from '~/common';
import { RelativeDateTime } from '../Formatters';

export const SavingStatus = ({
  submitting,
  savedAt,
}: {
  submitting: boolean;
  savedAt?: Nullable<DateTimeOrISO>;
}): ReactElement | null =>
  submitting ? (
    <>Saving...</>
  ) : savedAt ? (
    <>
      Saved <RelativeDateTime date={savedAt} />
    </>
  ) : null;
