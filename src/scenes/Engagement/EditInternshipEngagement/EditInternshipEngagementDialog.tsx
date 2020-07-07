import { Typography } from '@material-ui/core';
import { pick, startCase } from 'lodash';
import React, { FC } from 'react';
import { Except } from 'type-fest';
import {
  MethodologyToApproach,
  displayInternPosition,
  InternshipEngagementPosition,
  UpdateInternshipEngagementInput,
} from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  CheckboxesField,
  CheckboxOption,
  DateField,
  RadioField,
  RadioOption,
  SubmitError,
} from '../../../components/form';
import { InternshipEngagementDetailFragment } from '../InternshipEngagement/InternshipEngagement.generated';
import { useUpdateInternshipEngagementMutation } from './EditInternshipEngagementDialog.generated';

type EditInternshipEngagementDialogProps = Except<
  DialogFormProps<UpdateInternshipEngagementInput>,
  'onSubmit' | 'initialValues'
> & {
  engagement: InternshipEngagementDetailFragment;
  editValue?: string;
};

const internshipEngagementPositions: InternshipEngagementPosition[] = [
  'ExegeticalFacilitator',
  'TranslationConsultantInTraining',
  'AdministrativeSupportSpecialist',
  'BusinessSupportSpecialist',
  'CommunicationSpecialistInternal',
  'CommunicationSpecialistMarketing',
  'LanguageProgramManager',
  'LanguageProgramManagerOrFieldOperations',
  'LanguageSoftwareSupportSpecialist',
  'LeadershipDevelopment',
  'LiteracySpecialist',
  'LukePartnershipFacilitatorOrSpecialist',
  'MobilizerOrPartnershipSupportSpecialist',
  'OralFacilitatorOrSpecialist',
  'PersonnelOrHrSpecialist',
  'ScriptureUseSpecialist',
  'TechnicalSupportSpecialist',
  'TranslationFacilitator',
  'Translator',
];

export const EditInternshipEngagementDialog: FC<EditInternshipEngagementDialogProps> = ({
  engagement,
  editValue,
  ...props
}) => {
  const [updateEngagement] = useUpdateInternshipEngagementMutation();

  const title =
    editValue === 'startEndDate'
      ? 'Change Engagement Start and End Dates'
      : editValue === 'completeDate'
      ? 'Change Growth Plan Complete Date'
      : editValue === 'disbursementCompleteDate'
      ? 'Change Disbursement Complete Date'
      : editValue === 'communicationsCompleteDate'
      ? 'Change Communications Complete Date'
      : editValue === 'methodologies'
      ? 'Change Methodologies'
      : editValue === 'position'
      ? 'Change Intern Position'
      : null;

  const fields =
    editValue &&
    (editValue === 'startEndDate' ? (
      <>
        <Typography>Start Date</Typography>
        <DateField name="engagement.startDate" />
        <Typography>Start Date</Typography>
        <DateField name="engagement.endDate" />
      </>
    ) : [
        'completeDate',
        'disbursementCompleteDate',
        'communicationsCompleteDate',
      ].includes(editValue) ? (
      <>
        <Typography>Complete Date</Typography>
        <DateField name={`engagement.${editValue}`} />
      </>
    ) : editValue === 'methodologies' ? (
      <>
        <Typography>Methodologies</Typography>
        <CheckboxesField name="engagement.methodologies">
          {Object.keys(MethodologyToApproach).map((group) => (
            <CheckboxOption
              key={group}
              label={startCase(group)}
              value={group}
            />
          ))}
        </CheckboxesField>
      </>
    ) : editValue === 'position' ? (
      <>
        <RadioField name="engagement.position" label="Position">
          {internshipEngagementPositions.map((position) => (
            <RadioOption
              key={position}
              label={displayInternPosition(position)}
              value={position}
            />
          ))}
        </RadioField>
      </>
    ) : null);

  // Filter out relevant initial values so the other values don't get added to the mutation
  const fullEngagementInitialValues = {
    startDate: engagement.startDate.value,
    endDate: engagement.endDate.value,
    completeDate: engagement.completeDate.value,
    disbursementCompleteDate: engagement.disbursementCompleteDate.value,
    communicationsCompleteDate: engagement.communicationsCompleteDate.value,
    methodologies: engagement.methodologies.value,
    position: engagement.position.value,
  };
  const pickKeys =
    editValue === 'startEndDate'
      ? ['id', 'startDate', 'endDate']
      : ['id', editValue || ''];

  const filteredInitialValues = {
    engagement: {
      id: engagement.id,
      ...pick(fullEngagementInitialValues, pickKeys),
    },
  };

  return (
    <DialogForm<UpdateInternshipEngagementInput>
      title={title}
      closeLabel="Close"
      submitLabel="Update Engagement"
      {...props}
      initialValues={filteredInitialValues}
      onSubmit={(input) => {
        updateEngagement({ variables: { input } });
      }}
    >
      <SubmitError />
      {fields}
    </DialogForm>
  );
};
