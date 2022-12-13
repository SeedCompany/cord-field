import { useMutation } from '@apollo/client';
import type { OutputData as RichTextData } from '@editorjs/editorjs';
import { Card, Typography } from '@mui/material';
import { Decorator } from 'final-form';
import onFieldChange from 'final-form-calculate';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { RequiredKeysOf } from 'type-fest';
import type { ProgressReportVarianceExplanationReasonOptions as ReasonOptions } from '~/api/schema.graphql';
import { keys } from '~/common';
import {
  EnumField,
  SelectField,
  SubmitButton,
  SubmitError,
} from '~/components/form';
import { FormattedDateTime } from '~/components/Formatters';
import { RichTextField } from '~/components/RichText';
import { useProgressReportContext } from '../../ProgressReportContext';
import { ExplainProgressVarianceDocument } from './ExplanationOfProgress.graphql';

type OptionGroup = RequiredKeysOf<ReasonOptions>;

const groupLabelMap: Record<OptionGroup, string> = {
  behind: 'Behind / Delayed',
  onTime: 'On Time',
  ahead: 'Ahead',
};
const groups = keys(groupLabelMap);

const decorators: Array<Decorator<any>> = [
  onFieldChange({
    field: 'group',
    updates: {
      reason: (option, values, prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!prev.group) {
          // initializing, keep initial value
          return values.reason;
        }
        // Clear reason that's no longer shown in UI
        return null;
      },
    },
  }),
];

interface FormShape {
  group: OptionGroup;
  reason?: string;
  comments?: RichTextData;
}

export const ExplanationOfProgress = () => {
  const { report } = useProgressReportContext();
  const { varianceExplanation: explanation } = report;
  const optionsByGroup = explanation.reasonOptions;

  const [explainVariance] = useMutation(ExplainProgressVarianceDocument);
  const [savedAt, setSavedAt] = useState<DateTime | null>(null);

  const initialValues = useMemo((): FormShape => {
    const reason = explanation.reasons.value[0];
    return {
      group: reason
        ? groups.find((group) => optionsByGroup[group].includes(reason))!
        : 'onTime',
      reason: reason,
      comments: explanation.comments.value ?? undefined,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explanation]);

  const onSubmit = async (input: FormShape) => {
    await explainVariance({
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

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Explanation of Progress
      </Typography>
      <Typography paragraph>
        Please provide an explanation of the state of progress for this
        reporting period.
      </Typography>

      <Form<FormShape>
        onSubmit={onSubmit}
        decorators={decorators}
        initialValues={initialValues}
      >
        {({ handleSubmit, values: { group } }) => (
          <Card
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 2,
              // Allow RichText popups to bleed over card
              overflow: 'unset',
            }}
          >
            <SelectField
              name="group"
              options={groups}
              getOptionLabel={(group) => groupLabelMap[group]}
              variant="outlined"
            />

            {optionsByGroup[group].length > 0 && (
              <EnumField
                name="reason"
                label="Select a reason"
                options={optionsByGroup[group]}
                required
                layout="column"
              />
            )}

            <RichTextField
              name="comments"
              label="Optional Comments"
              tools={['paragraph', 'delimiter', 'marker']}
            />

            <SubmitError />
            <SubmitButton color="primary" size="medium" fullWidth={false}>
              Save
            </SubmitButton>
            {savedAt && (
              <Typography variant="caption" component="div" sx={{ mt: 1 }}>
                Saved at <FormattedDateTime date={savedAt} relative />
              </Typography>
            )}
          </Card>
        )}
      </Form>
    </>
  );
};
