import { Typography } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import React, { MouseEvent } from 'react';
import { useDialog } from '../../../components/Dialog';
import { SwitchField } from '../../../components/form';
import { entries } from '../../../util';
import {
  filterScriptureRangesByTestament,
  getScriptureRangeDisplay,
  matchingScriptureRanges,
  mergeScriptureRange,
  ScriptureRange,
  scriptureRangeDictionary,
} from '../../../util/biblejs';
import { newTestament, oldTestament } from './constants';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion, useStyles } from './SecuredAccordion';
import { VersesDialog, versesDialogValues } from './VersesDialog';

export interface ScriptureFormValues {
  book: string;
  updatingScriptures: ScriptureRange[];
}

declare module './ProductForm' {
  interface ProductFormCustomValues {
    scriptureReferences?: readonly ScriptureRange[];
    fullOldTestament?: boolean;
    fullNewTestament?: boolean;
  }
}

export const ScriptureReferencesSection = ({
  form,
  values,
  accordionState,
}: SectionProps) => {
  const classes = useStyles();
  const [versesDialogState, openVersesForm, verses] =
    useDialog<ScriptureFormValues>();

  const { fullNewTestament, fullOldTestament, scriptureReferences } =
    values.product ?? {};

  const openBook = (event: MouseEvent<HTMLButtonElement>) => {
    openVersesForm({
      book: event.currentTarget.value,
      updatingScriptures: matchingScriptureRanges(
        event.currentTarget.value,
        scriptureReferences
      ),
    });
  };

  const onVersesFieldSubmit = ({
    updatingScriptures,
    fullBook,
  }: versesDialogValues) => {
    verses &&
      form.change(
        // @ts-expect-error this is a valid field key
        'product.scriptureReferences',
        mergeScriptureRange(
          updatingScriptures,
          scriptureReferences,
          verses.book,
          fullBook
        )
      );
  };

  if (values.product?.productType === 'Other') {
    return null;
  }

  return (
    <>
      <SecuredAccordion
        {...accordionState}
        // TODO: maybe include scriptureReferencesOverride in the name to show api field error
        name="scriptureReferences"
        title="Scripture Reference"
        renderCollapsed={() => {
          const oldTestamentButton = fullOldTestament && (
            <ToggleButton
              key="fullOldTestament"
              value="fullNewTestament"
              selected
            >
              Full Old Testament
            </ToggleButton>
          );

          const newTestamentButton = fullNewTestament && (
            <ToggleButton
              key="fullNewTestament"
              value="fullNewTestament"
              selected
            >
              Full New Testament
            </ToggleButton>
          );

          const filteredScriptureRange = filterScriptureRangesByTestament(
            scriptureReferences,
            fullOldTestament,
            fullNewTestament
          );

          const scriptureRangeButtons = entries(
            scriptureRangeDictionary(filteredScriptureRange)
          ).map(([book, scriptureRangeArr]) => (
            <ToggleButton selected key={book} value={book}>
              {getScriptureRangeDisplay(scriptureRangeArr, book)}
            </ToggleButton>
          ));

          return [
            oldTestamentButton,
            ...scriptureRangeButtons,
            newTestamentButton,
          ];
        }}
      >
        {({ disabled }) => (
          <>
            <div className={classes.section}>
              <Typography className={classes.label}>Old Testament</Typography>
              <SwitchField
                name="fullOldTestament"
                label="Full Testament"
                color="primary"
              />
              <div className={classes.toggleButtonContainer}>
                {oldTestament.map((book) => {
                  const matchingArr = matchingScriptureRanges(
                    book,
                    scriptureReferences
                  );
                  return (
                    <ToggleButton
                      key={book}
                      value={book}
                      selected={Boolean(matchingArr.length) || fullOldTestament}
                      disabled={disabled || fullOldTestament}
                      onClick={openBook}
                    >
                      {fullOldTestament
                        ? book
                        : getScriptureRangeDisplay(matchingArr, book)}
                    </ToggleButton>
                  );
                })}
              </div>
            </div>
            <Typography className={classes.label}>New Testament</Typography>
            <SwitchField
              name="fullNewTestament"
              label="Full Testament"
              color="primary"
            />

            <div className={classes.toggleButtonContainer}>
              {newTestament.map((book) => {
                const matchingArr = matchingScriptureRanges(
                  book,
                  scriptureReferences
                );
                return (
                  <ToggleButton
                    key={book}
                    value={book}
                    selected={Boolean(matchingArr.length) || fullNewTestament}
                    disabled={disabled || fullNewTestament}
                    onClick={openBook}
                  >
                    {fullNewTestament
                      ? book
                      : getScriptureRangeDisplay(matchingArr, book)}
                  </ToggleButton>
                );
              })}
            </div>
          </>
        )}
      </SecuredAccordion>

      {verses && (
        <VersesDialog
          {...versesDialogState}
          {...verses}
          currentScriptureReferences={scriptureReferences}
          onSubmit={onVersesFieldSubmit}
        />
      )}
    </>
  );
};
