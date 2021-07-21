import { makeStyles, Typography } from '@material-ui/core';
import React, { useMemo } from 'react';
import { Except } from 'type-fest';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SwitchField } from '../../../components/form/SwitchField';
import { VersesField } from '../../../components/form/VersesField';
import { Nullable } from '../../../util';
import { isFullBookRange, ScriptureRange } from '../../../util/biblejs';
import { ScriptureFormValues } from './ScriptureReferencesSection';

const useStyles = makeStyles(({ spacing }) => ({
  dialogText: {
    margin: spacing(1, 0),
  },
}));

export interface versesDialogValues {
  updatingScriptures: ScriptureRange[];
  fullBook: boolean;
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

  const initialValues = useMemo(() => {
    const isFull = isFullBookRange(updatingScriptures[0], book);
    return {
      updatingScriptures: isFull ? [] : updatingScriptures,
      fullBook: isFull,
    };
  }, [book, updatingScriptures]);

  return (
    <DialogForm<versesDialogValues>
      {...dialogProps}
      title={book}
      initialValues={initialValues}
    >
      {({ values }: { values: versesDialogValues }) => {
        return (
          <>
            <Typography variant="h4" className={classes.dialogText}>
              Choose Your Chapters
            </Typography>
            <Typography className={classes.dialogText}>
              When choosing chapters and verses, you can make multiple
              selections. Input your wanted chapter/s and verses to create
              multiple selections.
            </Typography>
            <SwitchField name="fullBook" label="Full Book" color="primary" />
            {!values.fullBook && (
              <VersesField book={book} name="updatingScriptures" />
            )}
          </>
        );
      }}
    </DialogForm>
  );
};
