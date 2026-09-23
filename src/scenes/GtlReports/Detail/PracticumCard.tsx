import { useMutation } from '@apollo/client';
import { Add, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import { type RichTextJson } from '~/common';
import { useDialog } from '../../../components/Dialog';
import { DialogForm } from '../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../components/form';
import {
  UserField,
  type UserLookupItem,
} from '../../../components/form/Lookup';
import { IconButton } from '../../../components/IconButton';
import { RichTextField, RichTextView } from '../../../components/RichText';
import {
  CreateGtlReportPracticumDocument,
  DeleteGtlReportPracticumDocument,
  type GtlPracticumFragment,
  GtlReportDetailDocument,
} from './GtlReportDetail.graphql';

export const PracticumCard = ({
  reportId,
  practicums,
  editable = true,
}: {
  reportId: string;
  practicums: readonly GtlPracticumFragment[];
  editable?: boolean;
}) => {
  const [addState, add] = useDialog();

  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">
            Practicum &amp; Workshop Involvement
          </Typography>
          {editable && (
            <Button size="small" startIcon={<Add />} onClick={add}>
              Add
            </Button>
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary" paragraph>
          Training and hands-on work from the past three months, and what came
          of it.
        </Typography>

        {practicums.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nothing reported this quarter.
          </Typography>
        ) : (
          practicums.map((p) => (
            <PracticumRow key={p.id} practicum={p} editable={editable} />
          ))
        )}

        {editable && <AddPracticumDialog {...addState} reportId={reportId} />}
      </CardContent>
    </Card>
  );
};

const PracticumRow = ({
  practicum,
  editable,
}: {
  practicum: GtlPracticumFragment;
  editable: boolean;
}) => {
  const [remove] = useMutation(DeleteGtlReportPracticumDocument, {
    variables: { id: practicum.id },
    refetchQueries: [GtlReportDetailDocument],
  });
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body1" sx={{ flex: 1 }}>
          {practicum.involvement.value}
        </Typography>
        {editable && practicum.involvement.canEdit && (
          <IconButton size="small" onClick={() => void remove()}>
            <Delete fontSize="small" />
          </IconButton>
        )}
      </Stack>
      {practicum.mentor.value && (
        <Typography variant="caption" color="text.secondary">
          with {practicum.mentor.value.fullName}
        </Typography>
      )}
      {practicum.outcomes.value && (
        <RichTextView data={practicum.outcomes.value} />
      )}
    </Box>
  );
};

const AddPracticumDialog = ({
  reportId,
  ...props
}: { reportId: string } & ReturnType<typeof useDialog>[0]) => {
  const [create] = useMutation(CreateGtlReportPracticumDocument, {
    refetchQueries: [GtlReportDetailDocument],
  });
  return (
    <DialogForm<{
      involvement: string;
      mentor?: UserLookupItem;
      outcomes?: RichTextJson;
    }>
      {...props}
      title="Add practicum involvement"
      onSubmit={async ({ involvement, mentor, outcomes }) => {
        await create({
          variables: {
            input: {
              report: reportId,
              involvement,
              mentor: mentor?.id,
              outcomes,
            },
          },
        });
      }}
    >
      <SubmitError />
      <TextField
        name="involvement"
        label="Practicum or workshop"
        placeholder="What was taken part in?"
        required
        autoFocus
      />
      <UserField
        name="mentor"
        label="Mentor"
        placeholder="Who mentored this, if anyone?"
      />
      <RichTextField name="outcomes" label="Description of outcomes" />
    </DialogForm>
  );
};
