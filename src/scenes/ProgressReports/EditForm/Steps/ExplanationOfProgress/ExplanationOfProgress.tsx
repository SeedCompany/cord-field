import { useMutation } from '@apollo/client';
import type { OutputData as RichTextData } from '@editorjs/editorjs';
import { Card, CardContent, Typography } from '@mui/material';
import { Decorator } from 'final-form';
import onFieldChange from 'final-form-calculate';
import { startCase } from 'lodash';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { RequiredKeysOf } from 'type-fest';
import type { ProgressReportVarianceExplanationReasonOptions as ReasonOptions } from '~/api/schema.graphql';
import { canEditAny } from '~/common';
import {
  EnumField,
  EnumOption,
  SecuredField,
  SubmitButton,
  SubmitError,
} from '~/components/form';
import { FormattedDateTime } from '~/components/Formatters';
import { RichTextField, RichTextView } from '~/components/RichText';
import { ReportProp } from '../../ReportProp';
import { ExplainProgressVarianceDocument } from './ExplanationOfProgress.graphql';

type OptionGroup = RequiredKeysOf<ReasonOptions>;

const groups: OptionGroup[] = ['behind', 'onTime', 'ahead'];

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

export const ExplanationOfProgress = ({ report }: ReportProp) => {
  const { varianceExplanation: explanation } = report;
  const optionsByGroup = explanation.reasonOptions;

  const [explainVariance] = useMutation(ExplainProgressVarianceDocument);
  const [savedAt, setSavedAt] = useState<DateTime | null>(null);

  const initialValues = useMemo((): FormShape => {
    const reason = explanation.reasons.value[0];
    let group = reason
      ? groups.find((group) => optionsByGroup[group].includes(reason))!
      : undefined;

    if (!group) {
      const variance = report.cumulativeSummary?.variance;
      group = !variance
        ? 'onTime'
        : variance >= 0.1
        ? 'ahead'
        : variance >= -0.1
        ? 'behind'
        : 'onTime';
    }

    return {
      group,
      reason,
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

  if (!canEditAny(explanation)) {
    return (
      <>
        <Typography variant="h3" paragraph>
          Explanation of Progress
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {startCase(initialValues.group)}
            </Typography>
            {initialValues.reason}
            {initialValues.comments && (
              <>
                <Typography variant="h4" mt={2} gutterBottom>
                  Comments
                </Typography>
                <RichTextView data={initialValues.comments} />
              </>
            )}
          </CardContent>
        </Card>
      </>
    );
  }

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
            <EnumField
              name="group"
              variant="toggle-grouped"
              helperText={false}
              margin="none"
              disabled={!explanation.reasons.canEdit}
            >
              <EnumOption<OptionGroup>
                value="behind"
                label="Behind / Delayed"
                color="error"
              />
              <EnumOption<OptionGroup>
                value="onTime"
                label="On Time"
                color="info"
              />
              <EnumOption<OptionGroup>
                value="ahead"
                label="Ahead"
                color="success"
              />
            </EnumField>

            {optionsByGroup[group].length > 0 && (
              <EnumField
                name="reason"
                label="Select a reason"
                options={optionsByGroup[group]}
                required
                layout="column"
                disabled={!explanation.reasons.canEdit}
              />
            )}

            <SecuredField obj={explanation} name="comments">
              {(props) => (
                <RichTextField
                  label="Optional Comments"
                  tools={['paragraph', 'delimiter', 'marker']}
                  {...props}
                />
              )}
            </SecuredField>

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
