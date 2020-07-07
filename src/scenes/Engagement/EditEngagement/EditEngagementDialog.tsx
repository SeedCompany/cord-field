import { Typography } from '@material-ui/core';
import { pick, startCase } from 'lodash';
import React, { FC } from 'react';
import { Except } from 'type-fest';
import {
  MethodologyToApproach,
  displayInternPosition,
  InternshipEngagementPosition,
  UpdateInternshipEngagementInput,
  UpdateLanguageEngagementInput,
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
  TextField,
} from '../../../components/form';
import { InternshipEngagementDetailFragment } from '../InternshipEngagement/InternshipEngagement.generated';
import { LanguageEngagementDetailFragment } from '../LanguageEngagement/LanguageEngagementDetail.generated';
import {
  useUpdateInternshipEngagementMutation,
  useUpdateLanguageEngagementMutation,
} from './EditEngagementDialog.generated';

type EditEngagementDialogProps = Except<
  DialogFormProps<
    UpdateInternshipEngagementInput | UpdateInternshipEngagementInput
  >,
  'onSubmit' | 'initialValues'
> & {
  engagement:
    | InternshipEngagementDetailFragment
    | LanguageEngagementDetailFragment;
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

export const EditEngagementDialog: FC<EditEngagementDialogProps> = ({
  engagement,
  editValue,
  ...props
}) => {
  const [updateInternshipEngagement] = useUpdateInternshipEngagementMutation();
  const [updateLanguageEngagement] = useUpdateLanguageEngagementMutation();

  const updateEngagement =
    engagement.__typename === 'InternshipEngagement'
      ? updateInternshipEngagement
      : updateLanguageEngagement;

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
      : editValue === 'countryOfOrigin'
      ? 'Change Location'
      : editValue === 'mentor'
      ? 'Change Mentor'
      : null;

  const fields =
    editValue &&
    (editValue === 'startEndDate' ? (
      <>
        <Typography>Start Date</Typography>
        <DateField name="engagement.startDate" />
        <Typography>End Date</Typography>
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
      <RadioField name="engagement.position" label="Position">
        {internshipEngagementPositions.map((position) => (
          <RadioOption
            key={position}
            label={displayInternPosition(position)}
            value={position}
          />
        ))}
      </RadioField>
    ) : editValue === 'countryOfOrigin' ? (
      //TODO: replace with autocomplete when ready
      <TextField name="engagement.countryOfOriginId" />
    ) : editValue === 'mentor' ? (
      <TextField name="engagement.mentorId" />
    ) : null);

  // Filter out relevant initial values so the other values don't get added to the mutation
  const sharedInitialValues = {
    startDate: engagement.startDate.value,
    endDate: engagement.endDate.value,
    completeDate: engagement.completeDate.value,
    disbursementCompleteDate: engagement.disbursementCompleteDate.value,
    communicationsCompleteDate: engagement.communicationsCompleteDate.value,
  };

  const fullInitialValues =
    engagement.__typename === 'InternshipEngagement'
      ? {
          ...sharedInitialValues,
          methodologies: engagement.methodologies.value,
          position: engagement.position.value,
        }
      : sharedInitialValues;

  const pickKeys =
    editValue === 'startEndDate'
      ? ['id', 'startDate', 'endDate']
      : ['id', editValue || ''];

  const filteredInitialValues = {
    engagement: {
      id: engagement.id,
      ...pick(fullInitialValues, pickKeys),
    },
  };

  return (
    <DialogForm<UpdateInternshipEngagementInput | UpdateLanguageEngagementInput>
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
