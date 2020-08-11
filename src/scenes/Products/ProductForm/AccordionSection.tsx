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
import clsx from 'clsx';
import { startCase } from 'lodash';
import React, { useState } from 'react';
import { FormRenderProps } from 'react-final-form';
import {
  displayMethodologyWithLabel,
  displayScripture,
  ScriptureRangeInput,
} from '../../../api';
import {
  FieldGroup,
  NumberField,
  RadioField,
  RadioOption,
  SecuredField,
  SubmitButton,
  SubmitError,
  ToggleButtonOption,
  ToggleButtonsField,
} from '../../../components/form';
import {
  FilmField,
  LiteracyMaterialField,
  SongField,
  StoryField,
} from '../../../components/form/Lookup';
import { newTestament, oldTestament } from './constants';
import { getIsDerivativeProduct } from './helpers';
import { ProductFormFragment } from './ProductForm.generated';

const useStyles = makeStyles(({ spacing, typography }) => ({
  form: {
    '& > *': {
      marginBottom: spacing(2),
    },
  },
  accordionSummary: {
    flexDirection: 'column',
  },
  accordionSummaryButtonsContainer: {
    marginLeft: spacing(-1),
  },
  accordionSection: {
    display: 'flex',
    flexDirection: 'column',
    '& p': {
      fontWeight: typography.fontWeightBold,
      margin: spacing(2, 0),
    },
  },
  buttonListWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  booksWrapper: {
    marginLeft: spacing(-1),
  },
  submissionBlurb: {
    margin: spacing(4, 0),
    width: spacing(50),
  },
}));

const productField = {
  Film: <FilmField name="produces" label="Search Film" required />,
  Story: <StoryField name="produces" label="Search Story" required />,
  LiteracyMaterial: (
    <LiteracyMaterialField
      name="produces"
      label="Search Literacy Material"
      required
    />
  ),
  Song: <SongField name="produces" label="Search Song" required />,
};
const getProductField = (productType: keyof typeof productField) =>
  productField[productType];

export const renderAccordionSection = (productObj?: ProductFormFragment) => ({
  handleSubmit,
  values,
  form,
}: FormRenderProps) => {
  const classes = useStyles();

  const [openedSection, setOpenedSection] = useState<string>('produces');
  const [selectedBook, setSelectedBook] = useState<string>('');

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setOpenedSection(isExpanded ? panel : '');
  };

  const {
    methodology,
    productType,
    produces,
    scriptureReferences,
    mediums,
    purposes,
  } = values.product;

  const isDerivativeProduct = getIsDerivativeProduct(productType);

  const isProducesFieldMissing: boolean =
    form.getFieldState('product.produces')?.error === 'Required';

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <SubmitError />
      {/* TODO: secure this accordion with name=produces */}
      <FieldGroup prefix="product">
        <Accordion
          expanded={openedSection === 'produces'}
          onChange={handleChange('produces')}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            classes={{ content: classes.accordionSummary }}
          >
            <Typography variant="h4">Choose Product</Typography>
            <div className={classes.accordionSummaryButtonsContainer}>
              {productType && openedSection !== 'produces' && (
                <ToggleButton selected value={produces || ''}>
                  {`${startCase(productType)} ${
                    (isDerivativeProduct && produces?.name.value) || ''
                  }`}
                </ToggleButton>
              )}
              {isProducesFieldMissing && openedSection !== 'produces' && (
                <Typography variant="caption" color="error">
                  Product selection required
                </Typography>
              )}
            </div>
          </AccordionSummary>
          <RadioField name="productType" required={false}>
            <AccordionDetails className={classes.accordionSection}>
              <div>
                {['Scripture', 'Story', 'Film', 'Song', 'LiteracyMaterial'].map(
                  (option) => (
                    <RadioOption
                      key={option}
                      label={startCase(option)}
                      value={option}
                    />
                  )
                )}
              </div>
              {getProductField(productType)}
            </AccordionDetails>
          </RadioField>
        </Accordion>
        {/* //TODO: include scriptureReferencesOverride in the name */}
        <SecuredField obj={productObj} name="scriptureReferences">
          {({ disabled }) => (
            <Accordion
              expanded={openedSection === 'scriptureReferences'}
              onChange={handleChange('scriptureReferences')}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                classes={{ content: classes.accordionSummary }}
              >
                <Typography variant="h4">Choose Scripture</Typography>
                <div className={classes.accordionSummaryButtonsContainer}>
                  {openedSection !== 'scriptureReferences' &&
                    scriptureReferences?.map(
                      (scriptureRange: ScriptureRangeInput) => {
                        const rangeString = displayScripture(scriptureRange);
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
                </div>
              </AccordionSummary>
              <AccordionDetails className={classes.accordionSection}>
                <Typography>Old Testament</Typography>
                <div
                  className={clsx(
                    classes.buttonListWrapper,
                    classes.booksWrapper
                  )}
                >
                  {oldTestament.map((option) => {
                    const matchingScriptureRange = scriptureReferences?.find(
                      ({ start: { book } }: ScriptureRangeInput) =>
                        book === option
                    );
                    return (
                      <ToggleButton
                        key={option}
                        value={option}
                        selected={Boolean(matchingScriptureRange)}
                        disabled={disabled}
                        onClick={() => setSelectedBook(option)}
                      >
                        {matchingScriptureRange
                          ? //TODO: display the combined ranges when the logic from scripture pills is ready
                            displayScripture(matchingScriptureRange)
                          : option}
                      </ToggleButton>
                    );
                  })}
                </div>
                <Typography>New Testament</Typography>
                <div
                  className={clsx(
                    classes.buttonListWrapper,
                    classes.booksWrapper
                  )}
                >
                  {newTestament.map((option) => {
                    const matchingScriptureRange = scriptureReferences?.find(
                      ({ start: { book } }: ScriptureRangeInput) =>
                        book === option
                    );
                    return (
                      <ToggleButton
                        key={option}
                        value={option}
                        selected={Boolean(matchingScriptureRange)}
                        disabled={disabled}
                        onClick={() => setSelectedBook(option)}
                      >
                        {matchingScriptureRange
                          ? displayScripture(matchingScriptureRange)
                          : option}
                      </ToggleButton>
                    );
                  })}
                </div>
              </AccordionDetails>
            </Accordion>
          )}
        </SecuredField>
        <SecuredField obj={productObj} name="mediums">
          {(props) => (
            <Accordion
              expanded={openedSection === 'mediums'}
              onChange={handleChange('mediums')}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                classes={{ content: classes.accordionSummary }}
              >
                <Typography variant="h4">Choose Medium</Typography>
                <div className={classes.accordionSummaryButtonsContainer}>
                  {openedSection !== 'mediums' &&
                    mediums?.map((medium: string) => {
                      return (
                        <ToggleButton selected key={medium} value={medium}>
                          {startCase(medium)}
                        </ToggleButton>
                      );
                    })}
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <ToggleButtonsField {...props}>
                  {[
                    'Print',
                    'Web',
                    'EBook',
                    'App',
                    'Audio',
                    'OralTranslation',
                    'Video',
                    'Other',
                  ].map((option) => {
                    const label =
                      option === 'EBook' ? 'E-Book' : startCase(option);
                    return (
                      <ToggleButtonOption
                        key={option}
                        label={label}
                        value={option}
                      />
                    );
                  })}
                </ToggleButtonsField>
              </AccordionDetails>
            </Accordion>
          )}
        </SecuredField>
        <SecuredField obj={productObj} name="purposes">
          {(props) => (
            <Accordion
              expanded={openedSection === 'purposes'}
              onChange={handleChange('purposes')}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                classes={{ content: classes.accordionSummary }}
              >
                <Typography variant="h4">Choose Purposes</Typography>
                <div className={classes.accordionSummaryButtonsContainer}>
                  {openedSection !== 'purposes' &&
                    purposes?.map((purpose: string) => {
                      return (
                        <ToggleButton selected key={purpose} value={purpose}>
                          {startCase(purpose)}
                        </ToggleButton>
                      );
                    })}
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <ToggleButtonsField {...props}>
                  {[
                    'EvangelismChurchPlanting',
                    'ChurchLife',
                    'ChurchMaturity',
                    'SocialIssues',
                    'Discipleship',
                  ].map((option) => (
                    <ToggleButtonOption
                      key={option}
                      label={startCase(option)}
                      value={option}
                    />
                  ))}
                </ToggleButtonsField>
              </AccordionDetails>
            </Accordion>
          )}
        </SecuredField>
        <SecuredField obj={productObj} name="methodology">
          {(props) => (
            <Accordion
              expanded={openedSection === 'methodology'}
              onChange={handleChange('methodology')}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                classes={{ content: classes.accordionSummary }}
              >
                <Typography variant="h4">Choose Methodology</Typography>
                <div className={classes.accordionSummaryButtonsContainer}>
                  {methodology && openedSection !== 'methodology' && (
                    <ToggleButton selected value={methodology}>
                      {displayMethodologyWithLabel(methodology)}
                    </ToggleButton>
                  )}
                </div>
              </AccordionSummary>
              <RadioField {...props} required={false}>
                <AccordionDetails className={classes.accordionSection}>
                  <Typography>Written</Typography>
                  <div className={classes.buttonListWrapper}>
                    {['Paratext', 'OtherWritten'].map((option) => (
                      <RadioOption
                        key={option}
                        label={startCase(option)}
                        value={option}
                      />
                    ))}
                  </div>
                  <Typography>Oral Translation</Typography>
                  <div className={classes.buttonListWrapper}>
                    {['Render', 'OtherOralTranslation'].map((option) => (
                      <RadioOption
                        key={option}
                        label={startCase(option)}
                        value={option}
                      />
                    ))}
                  </div>
                  <Typography>Oral Stories</Typography>
                  <div className={classes.buttonListWrapper}>
                    {[
                      'BibleStories',
                      'BibleStorying',
                      'OneStory',
                      'OtherOralStories',
                    ].map((option) => (
                      <RadioOption
                        key={option}
                        label={startCase(option)}
                        value={option}
                      />
                    ))}
                  </div>
                  <Typography>Visual</Typography>
                  <div className={classes.buttonListWrapper}>
                    {['Film', 'SignLanguage', 'OtherVisual'].map((option) => (
                      <RadioOption
                        key={option}
                        label={startCase(option)}
                        value={option}
                      />
                    ))}
                  </div>
                </AccordionDetails>
              </RadioField>
            </Accordion>
          )}
        </SecuredField>
      </FieldGroup>
      <div className={classes.submissionBlurb}>
        <Typography variant="h4">Check Your Selections</Typography>
        <Typography>
          If the selections above look good to you. Go ahead and save your
          Product. If you need to edit your choices, do that above.
        </Typography>
      </div>
      <SubmitButton fullWidth={false} color="error" size="medium">
        Save Product
      </SubmitButton>
      <Dialog open={Boolean(selectedBook)}>
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
            onClick={() => {
              form.mutators.clear(
                'startChapter',
                'startVerse',
                'endChapter',
                'endVerse'
              );
              setSelectedBook('');
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              form.mutators.setScriptureReferencesField(selectedBook);
              form.mutators.clear(
                'startChapter',
                'startVerse',
                'endChapter',
                'endVerse'
              );
              setSelectedBook('');
            }}
          >
            Select
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};
