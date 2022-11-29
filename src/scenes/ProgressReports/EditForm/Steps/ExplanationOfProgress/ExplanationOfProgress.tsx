import { useMutation } from '@apollo/client';
import { Box, Card, Typography } from '@mui/material';
import { Decorator } from 'final-form';
import onFieldChange from 'final-form-calculate';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Form } from 'react-final-form';
import type * as Types from '~/api/schema.graphql';
import { DialogForm } from '~/components/Dialog/DialogForm';
import {
  EnumField,
  EnumOption,
  SelectField,
  SubmitButton,
} from '~/components/form';
import { FormattedDateTime } from '~/components/Formatters';
import { RichTextField } from '~/components/RichText';
import { useProgressReportContext } from '../../ProgressReportContext';
import { ExplainProgressVarianceDocument } from './ExplanationOfProgress.graphql';

const keyToLabel: Record<string, string> = {
  ahead: 'AHEAD',
  behind: 'BEHIND/DELAYED',
  onTime: 'ON TIME',
};

const decorators: Array<Decorator<any>> = [
  ...DialogForm.defaultDecorators,
  onFieldChange({
    field: 'option',
    updates: {
      reason: (option, values, prev) => {
        if (option) {
          return values.reason;
        }

        return prev.reason;
      },
    },
  }),
];

type OptionType = keyof Omit<
  Types.ProgressReportVarianceExplanationReasonOptions,
  '__typename'
>;

const findSelectedGroupKey = (
  reasonOptions: Types.ProgressReportVarianceExplanationReasonOptions,
  reason?: string
) => {
  if (!reason) {
    return Object.keys(reasonOptions).filter(
      (k) => !k.startsWith('__')
    )[0] as OptionType;
  }

  return Object.keys(reasonOptions).find((key) =>
    reasonOptions[key as OptionType].includes(reason)
  ) as OptionType;
};

export const ExplanationOfProgress = () => {
  const { report } = useProgressReportContext();
  const {
    varianceExplanation: { reasons, reasonOptions, comments },
  } = report;
  const [savedAt, setSavedAt] = useState<DateTime | null>(null);
  const [explainVariance] = useMutation(ExplainProgressVarianceDocument);

  const onSubmit = async (input: any) => {
    void explainVariance({
      variables: {
        input: {
          report: report.id,
          reasons: input.reason ? [input.reason] : [],
          comments: input.comments,
        },
      },
    });
    setSavedAt(DateTime.local());
  };

  const options = Object.keys(reasonOptions).filter((k) => !k.startsWith('__'));

  return (
    <div>
      <h2>Explanation of Progress</h2>
      <p>
        Please provide an explanation of the state of progress for this
        reporting period.
      </p>

      <Card sx={{ p: 2 }}>
        <Form
          onSubmit={onSubmit}
          decorators={decorators}
          initialValues={{
            option: findSelectedGroupKey(
              report.varianceExplanation.reasonOptions,
              reasons.value[0]
            ),
            reason: reasons.value[0],
            comments: comments.value,
          }}
        >
          {({ handleSubmit, values }) => {
            let option = values.option as OptionType;

            if (!values.option && reasons.value.length > 0) {
              option = findSelectedGroupKey(reasonOptions, reasons.value[0]);
            }

            const availableReasons = reasonOptions[option];

            return (
              <form onSubmit={handleSubmit}>
                <SelectField
                  name="option"
                  options={options}
                  getOptionLabel={(option) => keyToLabel[option] || option}
                  variant="outlined"
                  defaultValue={option}
                />

                {availableReasons.length > 0 && (
                  <EnumField name="reason" label="Select a reason">
                    <Box
                      defaultValue={reasons.value[0]}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {availableReasons.map((reason: any, id: any) => (
                        <EnumOption key={id} value={reason} label={reason} />
                      ))}
                    </Box>
                  </EnumField>
                )}

                <RichTextField
                  name="comments"
                  label="Optional Comments"
                  tools={['paragraph', 'delimiter', 'marker']}
                />
                {savedAt && (
                  <Typography variant="caption" sx={{ mb: 1 }} component="div">
                    Saved at <FormattedDateTime date={savedAt} relative />
                  </Typography>
                )}

                <SubmitButton variant="outlined" color="primary">
                  Save
                </SubmitButton>
              </form>
            );
          }}
        </Form>
      </Card>
    </div>
  );
};
