import { Add, Close, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  ToggleButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { entries, simpleSwitch } from '@seedcompany/common';
import { get, omit } from 'lodash';
import { useEffect, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import {
  getScriptureRangeDisplay,
  getUnspecifiedScriptureDisplay,
} from '~/common';
import {
  AutocompleteField,
  EnumField,
  VersesField,
} from '../../../components/form';
import { newTestament, oldTestament } from './constants';
import {
  DefaultAccordion,
  useStyles as useAccordionStyles,
} from './DefaultAccordion';
import { SectionProps } from './ProductFormFields';
import {
  newBookKey,
  ScriptureBookEntry,
  ScriptureBooks,
} from './scriptureBooks';
import { VersesCountField } from './VersesCountField';

declare module './ProductForm' {
  interface ProductFormCustomValues {
    scriptureBooks?: ScriptureBooks;
  }
}

const useStyles = makeStyles()(({ spacing }) => ({
  bookSummary: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(2),
  },
  addRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: spacing(1),
  },
}));

const allBooks = [...oldTestament, ...newTestament];

export const ScriptureReferencesSection = ({
  values,
  form,
  errors,
  submitFailed,
  submitting,
  accordionState,
}: SectionProps) => {
  const { classes: accordionClasses } = useAccordionStyles();
  const { classes } = useStyles();
  // undefined opens the first book, null collapses every book
  const [activeKey, setActiveKey] = useState<string | null>();

  const scriptureBooks = values.scriptureBooks ?? {};
  const bookEntries = entries(scriptureBooks);
  const isDirectScripture = values.productType === 'DirectScriptureProduct';
  const openKey =
    activeKey === null
      ? null
      : activeKey && scriptureBooks[activeKey]
      ? activeKey
      : bookEntries[0]?.[0];
  const openEntry = openKey ? scriptureBooks[openKey] : undefined;
  const hasEmptyBook = bookEntries.some(([, entry]) => !entry.book);
  const errorBookKeys = bookEntries.flatMap(([key]) =>
    get(errors, ['scriptureBooks', key]) ? key : []
  );
  const firstErrorBookKey = errorBookKeys[0];

  // Open the first book with an error after a failed save
  useEffect(() => {
    if (!submitting && submitFailed && firstErrorBookKey) {
      setActiveKey(firstErrorBookKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only after each save
  }, [submitting, submitFailed]);

  // Show the first book again each time the section opens
  const isSectionOpen = accordionState.openedSection === 'scriptureReferences';
  useEffect(() => {
    if (!isSectionOpen) setActiveKey(undefined);
  }, [isSectionOpen]);

  function toggleBook(key: string) {
    if (openKey && openKey !== key && !openEntry?.book) {
      form.change('scriptureBooks', omit(scriptureBooks, openKey));
    }
    setActiveKey(key === openKey ? null : key);
  }

  function addBook() {
    const bookKey = newBookKey(scriptureBooks);
    form.change('scriptureBooks', {
      ...scriptureBooks,
      [bookKey]: { bookSelection: 'full' },
    });
    setActiveKey(bookKey);
  }

  function removeBook(key: string) {
    form.change('scriptureBooks', omit(scriptureBooks, key));
  }

  return (
    <DefaultAccordion
      {...accordionState}
      name="scriptureReferences"
      errorName="scriptureBooks"
      title="Scripture Reference"
      renderCollapsed={() =>
        bookEntries.map(([key, entry]) =>
          entry.book ? (
            <ToggleButton selected key={key} value={key}>
              {getBookDisplay(entry, entry.book)}
            </ToggleButton>
          ) : null
        )
      }
    >
      <div>
        {bookEntries.map(([key, entry]) => {
          const otherBooks = bookEntries.flatMap(([otherKey, other]) =>
            otherKey !== key && other.book ? other.book : []
          );
          const fieldPrefix = `scriptureBooks.${key}`;
          const bookLabel = entry.book
            ? getBookDisplay(entry, entry.book)
            : 'New scripture reference';

          return (
            <Accordion
              key={key}
              variant="outlined"
              disableGutters
              expanded={key === openKey}
              onChange={() => toggleBook(key)}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                classes={{ content: classes.bookSummary }}
              >
                <Typography
                  color={
                    submitFailed && errorBookKeys.includes(key)
                      ? 'error'
                      : undefined
                  }
                >
                  {bookLabel}
                </Typography>
                {bookEntries.length > 1 && (
                  <Tooltip title="Remove scripture reference">
                    <IconButton
                      aria-label={`Remove ${bookLabel}`}
                      size="small"
                      onClick={(event) => {
                        // Stop the click from toggling the accordion
                        event.stopPropagation();
                        removeBook(key);
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </AccordionSummary>
              <AccordionDetails className={classes.bookDetails}>
                <AutocompleteField
                  label="Book"
                  name={`${fieldPrefix}.book`}
                  options={allBooks.filter(
                    (book) => !otherBooks.includes(book)
                  )}
                  groupBy={(book) =>
                    newTestament.includes(book)
                      ? 'New Testament'
                      : 'Old Testament'
                  }
                  selectOnFocus
                  openOnFocus
                  autoHighlight
                  variant="outlined"
                />
                {entry.book && (
                  <div className={accordionClasses.section}>
                    <EnumField
                      name={`${fieldPrefix}.bookSelection`}
                      required
                      options={[
                        'full',
                        'partialKnown',
                        ...(isDirectScripture ? ['partialUnknown'] : []),
                      ]}
                      defaultValue="full"
                      getLabel={(selection) =>
                        simpleSwitch(selection, {
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
                    {entry.bookSelection === 'partialKnown' ? (
                      <VersesField
                        name={`${fieldPrefix}.scriptureReferences`}
                        label="Chapter / Verse Selections"
                        book={entry.book}
                        required
                      />
                    ) : entry.bookSelection === 'partialUnknown' ? (
                      <VersesCountField
                        name={`${fieldPrefix}.totalVerses`}
                        label="Total verse count"
                        variant="outlined"
                        book={entry.book}
                        required
                      />
                    ) : null}
                  </div>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>

      {!isDirectScripture && (
        <div className={classes.addRow}>
          <Tooltip title="Add scripture reference">
            <span>
              <IconButton
                aria-label="Add scripture reference"
                color="primary"
                onClick={addBook}
                disabled={hasEmptyBook}
              >
                <Add />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      )}
    </DefaultAccordion>
  );
};

function getBookDisplay(entry: ScriptureBookEntry, book: string) {
  if (entry.bookSelection === 'full') {
    return book;
  }
  if (entry.bookSelection === 'partialUnknown' && entry.totalVerses) {
    return getUnspecifiedScriptureDisplay({
      book,
      totalVerses: entry.totalVerses,
    });
  }
  return getScriptureRangeDisplay(entry.scriptureReferences ?? [], book).trim();
}
