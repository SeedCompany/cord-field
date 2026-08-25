import { useMutation } from '@apollo/client';
import { Card, CardContent, Typography } from '@mui/material';
import { type GtlProgressStatus } from '~/api/schema.graphql';
import {
  GtlProgressStatusLabels,
  GtlProgressStatusList,
} from '~/api/schema/enumLists';
import { labelFrom, type RichTextJson } from '~/common';
import {
  EnumField,
  EnumOption,
  Form,
  SavingStatus,
  SubmitError,
} from '../../../components/form';
import { RichTextField, RichTextView } from '../../../components/RichText';
import {
  ExplainGtlProgressDocument,
  type GtlReportDetailFragment,
} from './GtlReportDetail.graphql';

/**
 * The Field Project Manager's read on how the internship is tracking.
 *
 * Confidential: the API decides whether this is readable at all, and the card
 * renders nothing when it isn't — so visibility is never a client-side guess.
 */
export const ProgressExplanationCard = ({
  reportId,
  explanation,
}: {
  reportId: string;
  explanation: GtlReportDetailFragment['progressExplanation'];
}) => {
  const [explain] = useMutation(ExplainGtlProgressDocument);
  const { status, context } = explanation;

  if (!status.canRead) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Explanation of Progress
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Completed by the Field Project Manager. Not shared outside Field
          Operations.
        </Typography>

        {!status.canEdit ? (
          status.value ? (
            <>
              <Typography variant="body1">
                {labelFrom(GtlProgressStatusLabels)(status.value)}
              </Typography>
              {context.value && <RichTextView data={context.value} />}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Not yet assessed.
            </Typography>
          )
        ) : (
          <Form<{ status?: GtlProgressStatus; context?: RichTextJson }>
            onSubmit={async (values) => {
              if (!values.status) return;
              await explain({
                variables: {
                  input: {
                    report: reportId,
                    status: values.status,
                    context: values.context,
                  },
                },
              });
            }}
            initialValues={{
              status: status.value ?? undefined,
              context: context.value ?? undefined,
            }}
            autoSubmit
            keepDirtyOnReinitialize
          >
            {({ handleSubmit, submitting }) => (
              <form onSubmit={handleSubmit}>
                <SubmitError />
                <EnumField name="status" required>
                  {GtlProgressStatusList.map((option) => (
                    <EnumOption
                      key={option}
                      value={option}
                      label={labelFrom(GtlProgressStatusLabels)(option)}
                    />
                  ))}
                </EnumField>
                <RichTextField
                  name="context"
                  label="Context"
                  helperText={
                    <>
                      Required if ahead of schedule, delayed, or needing a
                      change to plan. <SavingStatus submitting={submitting} />
                    </>
                  }
                />
              </form>
            )}
          </Form>
        )}
      </CardContent>
    </Card>
  );
};
