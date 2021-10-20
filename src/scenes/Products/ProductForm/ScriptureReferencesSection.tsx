import { ToggleButton } from '@material-ui/lab';
import React from 'react';
import { UnspecifiedScripturePortion } from '../../../api';
import {
  AutocompleteField,
  EnumField,
  VersesField,
} from '../../../components/form';
import { entries, simpleSwitch } from '../../../util';
import {
  getScriptureRangeDisplay,
  ScriptureRange,
  scriptureRangeDictionary,
} from '../../../util/biblejs';
import { newTestament, oldTestament } from './constants';
import { DefaultAccordion, useStyles } from './DefaultAccordion';
import { SectionProps } from './ProductFormFields';

declare module './ProductForm' {
  interface ProductFormCustomValues {
    scriptureReferences?: readonly ScriptureRange[];
    unspecifiedScripture?: Pick<UnspecifiedScripturePortion, 'totalVerses'>;
    book?: string;
    bookSelection: 'full' | 'partialKnown';
  }
}

export const ScriptureReferencesSection = ({
  values,
  accordionState,
}: SectionProps) => {
  const classes = useStyles();

  const { scriptureReferences, book, bookSelection } = values.product ?? {};

  if (values.product?.productType === 'Other') {
    return null;
  }

  return (
    <DefaultAccordion
      {...accordionState}
      name="scriptureReferences"
      title="Scripture Reference"
      renderCollapsed={() => {
        if (book && bookSelection === 'full') {
          return <ToggleButton selected children={book} />;
        }
        return entries(scriptureRangeDictionary(scriptureReferences)).map(
          ([book, scriptureRangeArr]) => (
            <ToggleButton selected key={book} value={book}>
              {getScriptureRangeDisplay(scriptureRangeArr, book)}
            </ToggleButton>
          )
        );
      }}
    >
      <div className={classes.section}>
        <AutocompleteField
          label="Book"
          name="book"
          options={[...oldTestament, ...newTestament]}
          groupBy={(book) =>
            newTestament.includes(book) ? 'New Testament' : 'Old Testament'
          }
          selectOnFocus
          openOnFocus
          autoHighlight
          variant="outlined"
        />

        {book && (
          <div className={classes.section}>
            <EnumField
              name="bookSelection"
              required
              options={['full', 'partialKnown']}
              defaultValue="full"
              getLabel={(key) =>
                simpleSwitch(key, {
                  full: 'Full Book',
                  partialKnown: 'Partial Book - Known References',
                })!
              }
              layout="column"
              margin="none"
              helperText={false}
            />
            {bookSelection === 'partialKnown' ? (
              <VersesField
                name="scriptureReferences"
                label="Chapter / Verse Selections"
                book={book}
                required
              />
            ) : null}
          </div>
        )}
      </div>
    </DefaultAccordion>
  );
};
