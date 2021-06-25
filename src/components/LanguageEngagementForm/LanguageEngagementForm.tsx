import { useMutation } from '@apollo/client';
import {
  Card,
  CardContent,
  Divider,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { isEqual } from 'lodash';
import React, { ComponentType, FC, useMemo } from 'react';
import { Form, FormSpy } from 'react-final-form';
import { Except } from 'type-fest';
import {
  UpdateCeremonyInput,
  UpdateInternshipEngagement,
  UpdateInternshipEngagementInput,
  UpdateLanguageEngagement,
  UpdateLanguageEngagementInput,
} from '../../api';
import { UpdateCeremonyDocument } from '../../scenes/Engagement/CeremonyCard/CeremonyCard.generated';
import { CeremonyPlanned } from '../../scenes/Engagement/CeremonyCard/CeremonyPlanned';
import {
  UpdateInternshipEngagementDocument,
  UpdateLanguageEngagementDocument,
} from '../../scenes/Engagement/EditEngagement/EditEngagementDialog.generated';
import { InternshipEngagementDetailFragment } from '../../scenes/Engagement/InternshipEngagement';
import { LanguageEngagementDetailFragment } from '../../scenes/Engagement/LanguageEngagement';
import { ExtractStrict, Many } from '../../util';
import {
  DateField,
  FieldGroup,
  SecuredEditableKeys,
  SecuredField,
} from '../form';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    fontSize: '12px',
    fontWeight: 'bold',
    paddingTop: spacing(2),
    marginBottom: spacing(2),
  },
}));

type Engagement =
  | InternshipEngagementDetailFragment
  | LanguageEngagementDetailFragment;

interface LanguageEngagementFormProps {
  engagement: Engagement;
}

interface EngagementFieldProps {
  props: {
    name: string;
  };
  engagement: Engagement;
}

type UpdateEngagementInput =
  | UpdateLanguageEngagementInput
  | UpdateInternshipEngagementInput;

type EditableEngagementField = ExtractStrict<
  | SecuredEditableKeys<LanguageEngagementDetailFragment>
  | SecuredEditableKeys<InternshipEngagementDetailFragment>,
  // Add more fields here as needed
  | 'startDateOverride'
  | 'endDateOverride'
  | 'completeDate'
  | 'disbursementCompleteDate'
>;

interface EngagementFormValues {
  engagement: UpdateLanguageEngagement & UpdateInternshipEngagement;
}

const fieldMapping: Record<
  EditableEngagementField,
  ComponentType<EngagementFieldProps>
> = {
  startDateOverride: ({ props }) => (
    <DateField
      {...props}
      label="Start Date"
      helperText="Leave blank to use project's start date"
    />
  ),
  endDateOverride: ({ props }) => (
    <DateField
      {...props}
      label="End Date"
      helperText="Leave blank to use project's end date"
    />
  ),
  completeDate: ({ props, engagement }) => (
    <DateField
      {...props}
      label={
        engagement.__typename === 'InternshipEngagement'
          ? 'Growth Plan Complete Date'
          : 'Translation Complete Date'
      }
    />
  ),
  disbursementCompleteDate: ({ props }) => (
    <DateField {...props} label="Disbursement Complete Date" />
  ),
};

export const LanguageEngagementForm: FC<LanguageEngagementFormProps> = ({
  engagement,
}) => {
  const classes = useStyles();

  const [updateLanguageEngagement] = useMutation(
    UpdateLanguageEngagementDocument
  );
  const [updateInternshipEngagement] = useMutation(
    UpdateInternshipEngagementDocument
  );

  const [updateCeremony] = useMutation(UpdateCeremonyDocument);

  const updateEngagement =
    engagement.__typename === 'InternshipEngagement'
      ? updateInternshipEngagement
      : updateLanguageEngagement;

  const editFields: Many<EditableEngagementField> = [
    'completeDate',
    'disbursementCompleteDate',
  ];
  const fields = editFields.map((name) => {
    const Field = fieldMapping[name];
    return (
      <SecuredField obj={engagement} name={name} key={name}>
        {(props) => <Field props={props} engagement={engagement} />}
      </SecuredField>
    );
  });

  const initialValues = useMemo(() => {
    const fullInitialValuesFields: Except<
      EngagementFormValues['engagement'],
      'id'
    > = {
      completeDate: engagement.completeDate.value,
      disbursementCompleteDate: engagement.disbursementCompleteDate.value,
    };

    return {
      engagement: {
        id: engagement.id,
        ...fullInitialValuesFields,
      },
    };
  }, [engagement]);

  const {
    id: ceremonyId,
    estimatedDate,
    actualDate,
  } = engagement.ceremony.value || {};

  const ceremonyInitialValues = useMemo(
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
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.header} variant="h3">
          DEDICATION DATE
        </Typography>
        <CeremonyPlanned
          canRead={engagement.ceremony.canRead}
          value={engagement.ceremony.value}
        />
        <Form<UpdateCeremonyInput>
          initialValues={ceremonyInitialValues}
          onSubmit={async (input) => {
            // This function is not triggered.
            await updateCeremony({ variables: { input } });
          }}
          render={() => (
            <>
              <FormSpy<UpdateCeremonyInput>
                subscription={{ values: true }}
                onChange={async ({ values: input }) => {
                  if (!isEqual(ceremonyInitialValues, input)) {
                    await updateCeremony({ variables: { input } });
                  }
                }}
              />
              <FieldGroup prefix="ceremony">
                <DateField
                  disabled={!engagement.ceremony.value?.planned.value}
                  name="estimatedDate"
                  label="Planned Date"
                />
                <DateField
                  name="actualDate"
                  label="Actual Date"
                  disabled={!engagement.ceremony.value?.planned.value}
                />
              </FieldGroup>
            </>
          )}
        />
        <Divider />

        <Typography className={classes.header} variant="h3">
          TRANSLATION DETAILS
        </Typography>
        <Form<UpdateEngagementInput>
          initialValues={initialValues}
          onSubmit={async (input) => {
            // This function is not triggered
            await updateEngagement({ variables: { input } });
          }}
          render={() => (
            <>
              <FormSpy<UpdateEngagementInput>
                subscription={{ values: true }}
                onChange={async ({ values: input }) => {
                  if (!isEqual(initialValues, input)) {
                    await updateEngagement({ variables: { input } });
                  }
                }}
              />
              <FieldGroup replace prefix="engagement">
                {fields}
              </FieldGroup>
            </>
          )}
        />
      </CardContent>
    </Card>
  );
};
