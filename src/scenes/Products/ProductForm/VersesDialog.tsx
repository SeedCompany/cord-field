import { makeStyles, Typography } from '@material-ui/core';
import React, { useMemo } from 'react';
import { Except } from 'type-fest';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { VersesField } from '../../../components/form/VersesField';
import { Nullable } from '../../../util';
import { ScriptureRange } from '../../../util/biblejs';
import { ScriptureFormValues } from './AccordionSection';

const useStyles = makeStyles(({ spacing }) => ({
  dialogText: {
    margin: spacing(1, 0),
  },
}));

export interface versesDialogValues {
  updatingScriptures: ScriptureRange[];
}

type VersesDialogProps = Except<
  DialogFormProps<versesDialogValues>,
  'initialValues'
> &
  ScriptureFormValues & {
    currentScriptureReferences: Nullable<readonly ScriptureRange[]>;
  };

export const VersesDialog = ({
  book,
  updatingScriptures,
  currentScriptureReferences,
  ...dialogProps
}: VersesDialogProps) => {
  const classes = useStyles();

  const initialValues = useMemo(() => ({ updatingScriptures }), [
    updatingScriptures,
  ]);

  return (
    <DialogForm<versesDialogValues>
      {...dialogProps}
      title={book}
      initialValues={initialValues}
    >
      <Typography variant="h4" className={classes.dialogText}>
        Choose Your Chapters
      </Typography>
      <Typography className={classes.dialogText}>
        When choosing chapters and verses, you can make multiple selections.
        Input your wanted chapter/s and verses to create multiple selections.
      </Typography>
      <VersesField book={book} name="updatingScriptures" />
    </DialogForm>
  );
};
