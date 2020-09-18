import { makeStyles, Typography } from '@material-ui/core';
import { FormApi } from 'final-form';
import React from 'react';
import { Except } from 'type-fest';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { VersesField } from '../../../components/form/VersesField';
import { mergeScriptureRange, ScriptureRange } from '../../../util/biblejs';
import { ScriptureFormValues } from './AccordionSection';

const useStyles = makeStyles(({ spacing }) => ({
  dialogText: {
    margin: spacing(1, 0),
  },
}));

interface versesDialogValues {
  updatingScriptures: ScriptureRange[];
}

type VersesDialogProps = Except<
  DialogFormProps<versesDialogValues>,
  'onSubmit' | 'initialValues'
> &
  ScriptureFormValues & {
    currentScriptureReferences: ScriptureRange[];
    changeField: FormApi['change'];
  };

export const VersesDialog = ({
  book,
  updatingScriptures,
  currentScriptureReferences,
  changeField,
  ...dialogState
}: VersesDialogProps) => {
  const classes = useStyles();

  return (
    <DialogForm<versesDialogValues>
      {...dialogState}
      title={book}
      initialValues={{ updatingScriptures }}
      onSubmit={({ updatingScriptures }) => {
        changeField(
          'product.scriptureReferences',
          mergeScriptureRange(
            updatingScriptures,
            currentScriptureReferences,
            book
          )
        );
      }}
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
