import { useMutation } from '@apollo/client';
import { isEqual, noop } from 'lodash';
import React, { useMemo } from 'react';
import { Form, FormSpy } from 'react-final-form';
import { UpdateCeremonyInput } from '../../../../api';
import { DateField, FieldGroup } from '../../../../components/form';
import {
  CeremonyCardFragment,
  UpdateCeremonyDocument,
} from '../../CeremonyCard/CeremonyCard.generated';
import { CeremonyPlanned } from '../../CeremonyCard/CeremonyPlanned';

export const CeremonyForm = ({
  ceremony,
}: {
  ceremony: CeremonyCardFragment;
}) => {
  const [updateCeremony] = useMutation(UpdateCeremonyDocument);

  const { id: ceremonyId, estimatedDate, actualDate } = ceremony.value || {};

  const initialValues = useMemo(
    () => ({
      ceremony: {
        id: ceremonyId || '',
        estimatedDate: estimatedDate?.value,
        actualDate: actualDate?.value,
      },
    }),
    [actualDate?.value, ceremonyId, estimatedDate?.value]
  );

  return (
    <>
      <CeremonyPlanned {...ceremony} />
      <Form<UpdateCeremonyInput> initialValues={initialValues} onSubmit={noop}>
        {() => (
          <FieldGroup prefix="ceremony">
            <FormSpy<UpdateCeremonyInput>
              subscription={{ values: true }}
              onChange={async ({ values: input }) => {
                if (!isEqual(initialValues, input)) {
                  await updateCeremony({ variables: { input } });
                }
              }}
            />
            <DateField
              disabled={!ceremony.value?.planned.value}
              name="estimatedDate"
              label="Planned Date"
            />
            <DateField
              name="actualDate"
              label="Actual Date"
              disabled={!ceremony.value?.planned.value}
            />
          </FieldGroup>
        )}
      </Form>
    </>
  );
};
