import { DateTime } from 'luxon';
import { ReactElement } from 'react';
import { Nullable } from '../../common';
import { RelativeDateTime } from '../Formatters';

export const SavingStatus = ({
  submitting,
  savedAt,
}: {
  submitting: boolean;
  savedAt?: Nullable<DateTime>;
}): ReactElement | null =>
  submitting ? (
    <>Saving...</>
  ) : savedAt ? (
    <>
      Saved <RelativeDateTime date={savedAt} />
    </>
  ) : null;
