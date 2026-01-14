import { useMutation } from '@apollo/client';
import { Card, CardContent, Tooltip, Typography } from '@mui/material';
import { IterableItem } from '@seedcompany/common';
import { Decorator } from 'final-form';
import onFieldChange from 'final-form-calculate';
import { camelCase } from 'lodash';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import type { ProgressReportVarianceExplanationReasonOptions as ReasonOptions } from '~/api/schema.graphql';
import { canEditAny, RichTextJson } from '~/common';
import {
  EnumField,
  EnumOption,
  Form,
  FormProps,
  SavingStatus,
  SecuredField,
  SubmitError,
} from '~/components/form';
import { RichTextField } from '~/components/RichText';
import { VarianceExplanation } from '../../../Detail/VarianceExplanation/VarianceExplanation';
import { StepComponent } from '../step.types';
import { ExplainProgressVarianceDocument } from './ExplanationOfProgress.graphql';

type OptionGroup = IterableItem<typeof groups>;

const groups = ['behind', 'onTime', 'ahead'] satisfies Array<
  keyof ReasonOptions
>;

const decorators: Array<Decorator<FormShape>> = [
  onFieldChange({
    field: 'group',
    updates: {
      reasons: (option, values, prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!prev.group) {
          // initializing, keep initial value
          return values.reasons;
        }
        // Clear reason that's no longer shown in UI
        return null;
      },
    },
  }),
];

interface FormShape {
  group: OptionGroup;
  reasons?: string;
  comments?: RichTextJson;
}

export const ExplanationOfProgress: StepComponent = ({ report }) => {
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
      group = camelCase(
        report.varianceExplanation.scheduleStatus ?? 'OnTime'
      ) as OptionGroup;
    }

    return {
      group,
      reasons: reason,
      comments: explanation.comments.value ?? undefined,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explanation]);

  const onSubmit: FormProps<FormShape>['onSubmit'] = async (input) => {
    await explainVariance({
      variables: {
        input: {
          report: report.id,
          reasons: input.reasons ? [input.reasons] : [],
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
            <VarianceExplanation data={explanation} />
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
        Select the appropriate state of Language Engagement Goal/Translation
        Progress.
      </Typography>

      <Form<FormShape>
        onSubmit={onSubmit}
        decorators={decorators}
        initialValues={initialValues}
        autoSubmit
        keepDirtyOnReinitialize
      >
        {({ handleSubmit, values: { group, reasons }, submitting }) => (
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
              required
            >
              {/* Source or truth for thresholds:
                  https://github.com/SeedCompany/cord-api-v3/blob/master/src/components/progress-summary/dto/schedule-status.enum.ts#L13-L17 */}
              <Tooltip title="> -10%" placement="top">
                <EnumOption<OptionGroup>
                  value="behind"
                  label="Behind / Delayed"
                  color="error"
                />
              </Tooltip>
              <Tooltip title="-10% to 30%" placement="top">
                <EnumOption<OptionGroup>
                  value="onTime"
                  label="On Time"
                  color="info"
                />
              </Tooltip>
              <Tooltip title="> 30%" placement="top">
                <EnumOption<OptionGroup>
                  value="ahead"
                  label="Ahead"
                  color="success"
                />
              </Tooltip>
            </EnumField>

            {optionsByGroup[group].length > 0 && (
              <EnumField
                name="reasons"
                label="Required: Select a reason below"
                layout="column"
                disabled={!explanation.reasons.canEdit}
              >
                {optionsByGroup[group].flatMap((reason) => {
                  const isDeprecated =
                    optionsByGroup.deprecated.includes(reason);
                  if (isDeprecated && reason !== reasons) {
                    // Don't even show deprecated options if they are not currently selected
                    return [];
                  }
                  return (
                    <EnumOption
                      key={reason}
                      label={reason}
                      value={reason}
                      disabled={isDeprecated}
                    />
                  );
                })}
              </EnumField>
            )}

            <SecuredField obj={explanation} name="comments">
              {(props) => (
                <RichTextField
                  placeholder="Optional: Audience - internal - Add clarifying information you would like to share internally with Seed Co team members"
                  label="Optional Comments"
                  tools={['paragraph', 'delimiter', 'marker']}
                  {...props}
                  helperText={
                    <SavingStatus submitting={submitting} savedAt={savedAt} />
                  }
                />
              )}
            </SecuredField>
            <SubmitError />
          </Card>
        )}
      </Form>
    </>
  );
};

ExplanationOfProgress.enableWhen = ({ report }) =>
  report.varianceExplanation.reasons.canRead;

ExplanationOfProgress.isIncomplete = ({ report }) => ({
  isIncomplete:
    report.varianceExplanation.scheduleStatus !== 'OnTime' &&
    !report.varianceExplanation.reasons.value[0] &&
    report.varianceExplanation.reasons.canEdit,
  severity: 'required',
});
