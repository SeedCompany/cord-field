import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { ToggleButton } from '@material-ui/lab';
import React, { FC, useState } from 'react';
import { Form, FormProps } from 'react-final-form';
import { ScriptureRangeInput } from '../../../api';
import {
  NumberField,
  SubmitButton,
  SubmitError,
  TextField,
  ToggleButtonOption,
  ToggleButtonsField,
} from '../../../components/form';
import {
  methodologyCategories,
  newTestament,
  oldTestament,
} from '../Create/constants';

const useStyles = makeStyles(({ spacing }) => ({
  form: {
    '& > *': {
      marginBottom: spacing(2),
    },
  },
  productSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  accordionSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonListWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}));

type ProductFormProps = Pick<FormProps, 'onSubmit'>;

export const ProductForm: FC<ProductFormProps> = ({ onSubmit }) => {
  const classes = useStyles();

  const [openedSection, setOpenedSection] = useState<string>('produces');

  const parseScriptureRange = ({
    books: [book],
    startChapter,
    startVerse,
    endChapter,
    endVerse,
  }: any) => ({
    start: {
      book,
      chapter: startChapter,
      verse: startVerse,
    },
    end: {
      book,
      chapter: endChapter,
      verse: endVerse,
    },
  });

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setOpenedSection(isExpanded ? panel : '');
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        scriptureReferences: [],
        mediums: ['originalmed'],
      }}
      mutators={{
        clear: (fieldNames, state, { changeValue }) => {
          fieldNames.forEach((name: string) =>
            changeValue(state, name, () => undefined)
          );
        },
        setScriptureReferencesField: (_args, state, { changeValue }) => {
          changeValue(state, 'scriptureReferences', (scriptureReferences) => [
            ...scriptureReferences,
            parseScriptureRange(state.formState.values),
          ]);
        },
      }}
    >
      {({ handleSubmit, values, form }) => {
        console.log('values: ', values);
        const productType = values.productType?.[0];
        const produces = values.produces;

        const methodology = values.methodology?.[0];
        const methodologyButtonText = `${methodologyCategories[methodology]} - ${methodology}`;
        return (
          <form onSubmit={handleSubmit} className={classes.form}>
            <SubmitError />
            <Accordion
              expanded={openedSection === 'produces'}
              onChange={handleChange('produces')}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Choose Product</Typography>
                {productType && openedSection !== 'produces' && (
                  <ToggleButton selected value={produces || ''}>
                    {`${productType} ${produces || ''}`}
                  </ToggleButton>
                )}
              </AccordionSummary>
              <AccordionDetails className={classes.productSection}>
                <ToggleButtonsField name="productType" pickOne>
                  {[
                    'scripture',
                    'story',
                    'film',
                    'song',
                    'literacyMaterial',
                  ].map((option) => (
                    <ToggleButtonOption
                      key={option}
                      label={option}
                      value={option}
                    />
                  ))}
                </ToggleButtonsField>
                <TextField
                  name="produces"
                  disabled={
                    !['story', 'film', 'song', 'literacyMaterial'].includes(
                      values.productType?.[0]
                    )
                  }
                />
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={openedSection === 'scriptureReferences'}
              onChange={handleChange('scriptureReferences')}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Scripture Ranges</Typography>
                {values.scriptureReferences?.map(
                  (scriptureRange: ScriptureRangeInput) => {
                    const rangeString = `${scriptureRange.start.book} ${scriptureRange.start.chapter}:${scriptureRange.start.verse} -  ${scriptureRange.end.chapter}:${scriptureRange.end.verse}`;
                    return (
                      <ToggleButton
                        selected
                        key={rangeString}
                        value={scriptureRange}
                      >
                        {rangeString}
                      </ToggleButton>
                    );
                  }
                )}
              </AccordionSummary>
              <AccordionDetails>
                <ToggleButtonsField
                  name="books"
                  pickOne
                  className={classes.accordionSection}
                >
                  <Typography variant="h6">Old Testament</Typography>
                  <div className={classes.buttonListWrapper}>
                    {oldTestament.map((option) => (
                      <ToggleButtonOption
                        key={option}
                        label={option}
                        value={option}
                      />
                    ))}
                  </div>
                  <Typography variant="h6">New Testament</Typography>
                  <div className={classes.buttonListWrapper}>
                    {newTestament.map((option) => (
                      <ToggleButtonOption
                        key={option}
                        label={option}
                        value={option}
                      />
                    ))}
                  </div>
                </ToggleButtonsField>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={openedSection === 'mediums'}
              onChange={handleChange('mediums')}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Choose Medium</Typography>
                {openedSection !== 'mediums' &&
                  values.mediums?.map((medium: string) => {
                    return (
                      <ToggleButton selected key={medium} value={medium}>
                        {medium}
                      </ToggleButton>
                    );
                  })}
              </AccordionSummary>
              <AccordionDetails>
                <ToggleButtonsField name="mediums">
                  {[
                    'Print',
                    'Web',
                    'EBook',
                    'App',
                    'Audio',
                    'OralTranslation',
                    'Video',
                    'Other',
                  ].map((option) => (
                    <ToggleButtonOption
                      key={option}
                      label={option}
                      value={option}
                    />
                  ))}
                </ToggleButtonsField>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={openedSection === 'purposes'}
              onChange={handleChange('purposes')}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Choose Purposes</Typography>
                {openedSection !== 'purposes' &&
                  values.purposes?.map((purpose: string) => {
                    return (
                      <ToggleButton selected key={purpose} value={purpose}>
                        {purpose}
                      </ToggleButton>
                    );
                  })}
              </AccordionSummary>
              <AccordionDetails>
                <ToggleButtonsField name="purposes">
                  {[
                    'EvangelismChurchPlanting',
                    'ChurchLife',
                    'ChurchMaturity',
                    'SocialIssues',
                    'Discipleship',
                  ].map((option) => (
                    <ToggleButtonOption
                      key={option}
                      label={option}
                      value={option}
                    />
                  ))}
                </ToggleButtonsField>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={openedSection === 'methodology'}
              onChange={handleChange('methodology')}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Choose Methodology</Typography>
                {methodology && openedSection !== 'methodology' && (
                  <ToggleButton selected value={methodology}>
                    {methodologyButtonText}
                  </ToggleButton>
                )}
              </AccordionSummary>
              <ToggleButtonsField name="methodology" pickOne>
                <AccordionDetails className={classes.accordionSection}>
                  <Typography variant="h6">Written</Typography>
                  <div className={classes.buttonListWrapper}>
                    {['Paratext', 'OtherWritten'].map((option) => (
                      <ToggleButtonOption
                        key={option}
                        label={option}
                        value={option}
                      />
                    ))}
                  </div>
                  <Typography variant="h6">Oral Translation</Typography>
                  <div className={classes.buttonListWrapper}>
                    {['Render', 'OtherOralTranslation'].map((option) => (
                      <ToggleButtonOption
                        key={option}
                        label={option}
                        value={option}
                      />
                    ))}
                  </div>
                  <Typography variant="h6">Oral Stories</Typography>
                  <div className={classes.buttonListWrapper}>
                    {[
                      'BibleStories',
                      'BibleStorying',
                      'OneStory',
                      'OtherOralStories',
                    ].map((option) => (
                      <ToggleButtonOption
                        key={option}
                        label={option}
                        value={option}
                      />
                    ))}
                  </div>
                  <Typography variant="h6">Visual</Typography>
                  <div className={classes.buttonListWrapper}>
                    {['Film', 'SignLanguage', 'OtherVisual'].map((option) => (
                      <ToggleButtonOption
                        key={option}
                        label={option}
                        value={option}
                      />
                    ))}
                  </div>
                </AccordionDetails>
              </ToggleButtonsField>
            </Accordion>

            <SubmitButton fullWidth={false} color="primary" size="medium">
              Submit
            </SubmitButton>
            <Dialog open={Boolean(values.books?.[0])}>
              <DialogTitle>Choose Verse</DialogTitle>
              <DialogContent>
                <Typography>Start</Typography>
                <NumberField
                  name="startChapter"
                  placeholder="start chapter"
                  required
                ></NumberField>
                <NumberField
                  name="startVerse"
                  placeholder="start verse"
                  required
                ></NumberField>

                <Typography>End</Typography>
                <NumberField
                  name="endChapter"
                  placeholder="end chapter"
                  required
                ></NumberField>
                <NumberField
                  name="endVerse"
                  placeholder="end verse"
                  required
                ></NumberField>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() =>
                    form.mutators.clear(
                      'books',
                      'startChapter',
                      'startVerse',
                      'endChapter',
                      'endVerse'
                    )
                  }
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    form.mutators.setScriptureReferencesField();
                    form.mutators.clear(
                      'books',
                      'startChapter',
                      'startVerse',
                      'endChapter',
                      'endVerse'
                    );
                  }}
                >
                  Select
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        );
      }}
    </Form>
  );
};
