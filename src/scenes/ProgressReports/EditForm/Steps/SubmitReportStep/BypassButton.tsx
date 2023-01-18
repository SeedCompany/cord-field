import {
  ProgressReportStatusLabels as StatusLabels,
  ProgressReportStatusList as StatusList,
} from '~/api/schema/enumLists';
import { ProgressReportStatus as Status } from '~/api/schema/schema.graphql';
import { labelFrom } from '~/common';
import { SubmitButton } from '~/components/form';
import { SplitButton, SplitButtonProps } from '~/components/SplitButton';

export const BypassButton = (
  props: Omit<SplitButtonProps<Status | undefined>, 'options'>
) => (
  <SplitButton
    options={StatusList}
    getValueLabel={labelFrom(StatusLabels)}
    fullWidth
    color="primary"
    aria-label={`Bypass workflow to ${
      props.value ? StatusLabels[props.value] : 'a certain'
    } status`}
    SplitButtonProps={{
      'aria-label': 'Select status to bypass to',
    }}
    {...props}
  >
    <SubmitButton
      size="medium"
      color="primary"
      action="bypass"
      sx={{
        // Offset text to horizontally center it by ignoring the split arrow button.
        // This makes it look better amongst the other transition buttons.
        '& > :first-of-type': { paddingLeft: '40px' },
      }}
    >
      {props.value
        ? StatusLabels[props.value]
        : 'Bypass to a certain status — Click arrow to select'}
    </SubmitButton>
  </SplitButton>
);
