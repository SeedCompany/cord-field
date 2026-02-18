import { ToggleButton } from '@mui/material';
import { entries, groupToMapBy, simpleSwitch } from '@seedcompany/common';
import { UnspecifiedScripturePortion } from '~/api/schema.graphql';
import {
  getScriptureRangeDisplay,
  getUnspecifiedScriptureDisplay,
  ScriptureRange,
} from '~/common';
import {
  AutocompleteField,
  EnumField,
  VersesField,
} from '../../../components/form';
import { newTestament, oldTestament } from './constants';
import { DefaultAccordion, useStyles } from './DefaultAccordion';
import { SectionProps } from './ProductFormFields';
import { VersesCountField } from './VersesCountField';

declare module './ProductForm' {
  interface ProductFormCustomValues {
    scriptureReferences?: readonly ScriptureRange[];
    unspecifiedScripture?: Pick<UnspecifiedScripturePortion, 'totalVerses'>;
    book?: string;
    bookSelection: 'full' | 'partialKnown' | 'partialUnknown';
  }
}

export const ScriptureReferencesSection = ({
  values,
  accordionState,
}: SectionProps) => {
  const { classes } = useStyles();

  const { scriptureReferences, book, bookSelection, unspecifiedScripture } =
    values;

  if (values.productType === 'Other') {
    return null;
  }

  return (
    <DefaultAccordion
      {...accordionState}
      name="scriptureReferences"
      title="Scripture Reference"
      renderCollapsed={() => {
        if (book && bookSelection === 'full') {
          return <ToggleButton selected children={book} value="full" />;
        }

        if (book && unspecifiedScripture) {
          return (
            <ToggleButton selected value="partialUnspecified">
              {getUnspecifiedScriptureDisplay({
                book,
                ...unspecifiedScripture,
              })}
            </ToggleButton>
          );
        }

        return entries(
          groupToMapBy(scriptureReferences ?? [], (range) => range.start.book)
        ).map(([book, scriptureRangeArr]) => (
          <ToggleButton selected key={book} value={book}>
            {getScriptureRangeDisplay(scriptureRangeArr, book)}
          </ToggleButton>
        ));
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
              options={[
                'full',
                'partialKnown',
                ...(values.productType === 'DirectScriptureProduct'
                  ? ['partialUnknown']
                  : []),
              ]}
              defaultValue="full"
              getLabel={(key) =>
                simpleSwitch(key, {
                  full: 'Full Book',
                  partialKnown: 'Partial Book - Known References',
                  partialUnknown:
                    'Partial Book - Unknown References - Only total verse count',
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
            ) : bookSelection === 'partialUnknown' ? (
              <VersesCountField
                name="unspecifiedScripture.totalVerses"
                label="Total verse count"
                variant="outlined"
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
