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
import { startCase } from 'lodash';
import React, { useState } from 'react';
import { FormRenderProps } from 'react-final-form';
import { ScriptureRangeInput } from '../../../api';
import {
  NumberField,
  RadioField,
  RadioOption,
  SecuredField,
  SubmitButton,
  SubmitError,
  TextField,
  ToggleButtonOption,
  ToggleButtonsField,
} from '../../../components/form';
import { methodologyCategories, newTestament, oldTestament } from './constants';
import { ProductFormFragment } from './ProductForm.generated';

const useStyles = makeStyles(({ spacing }) => ({
  form: {
    '& > *': {
      marginBottom: spacing(2),
    },
  },
  accordionSummary: {
    flexDirection: 'column',
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

export const renderAccordionSection = (productObj?: ProductFormFragment) => ({
  handleSubmit,
  values,
  form,
}: FormRenderProps) => {
  const classes = useStyles();

  const [openedSection, setOpenedSection] = useState<string>('produces');

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setOpenedSection(isExpanded ? panel : '');
  };

  const productType = values.productType;
  const produces = values.produces || '';
  const isDerivativeProduct = [
    'Story',
    'Film',
    'Song',
    'LiteracyMaterial',
  ].includes(productType);

  const methodology = values.methodology;
  const methodologyButtonText = `${startCase(
    methodologyCategories[methodology]
  )} - ${startCase(methodology)}`;
  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <SubmitError />
      {/* TODO: secure this accordion with name=produces */}
      <Accordion
        expanded={openedSection === 'produces'}
        onChange={handleChange('produces')}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          classes={{ content: classes.accordionSummary }}
        >
          <Typography variant="h5">Choose Product</Typography>
          <div>
            {productType && openedSection !== 'produces' && (
              <ToggleButton selected value={produces}>
                {`${startCase(productType)} ${
                  isDerivativeProduct ? produces : ''
                }`}
              </ToggleButton>
            )}
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.productSection}>
          <RadioField name="productType" required={false}>
            {['Scripture', 'Story', 'Film', 'Song', 'LiteracyMaterial'].map(
              (option) => (
                <RadioOption
                  key={option}
                  label={startCase(option)}
                  value={option}
                />
              )
            )}
          </RadioField>
          {isDerivativeProduct && <TextField name="produces" required />}
        </AccordionDetails>
      </Accordion>

      {/* //TODO: include scriptureReferencesOverride in the name */}
      <SecuredField obj={productObj} name="scriptureReferences">
        {(props) => (
          <Accordion
            expanded={openedSection === 'scriptureReferences'}
            onChange={handleChange('scriptureReferences')}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              classes={{ content: classes.accordionSummary }}
            >
              <Typography variant="h5">Scripture Ranges</Typography>
              <div>
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
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <RadioField
                {...props}
                name="book"
                className={classes.accordionSection}
                required={false}
              >
                <Typography variant="h6">Old Testament</Typography>
                <div className={classes.buttonListWrapper}>
                  {oldTestament.map((option) => (
                    <RadioOption key={option} label={option} value={option} />
                  ))}
                </div>
                <Typography variant="h6">New Testament</Typography>
                <div className={classes.buttonListWrapper}>
                  {newTestament.map((option) => (
                    <RadioOption key={option} label={option} value={option} />
                  ))}
                </div>
              </RadioField>
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
              <Typography variant="h5">Choose Medium</Typography>
              <div>
                {openedSection !== 'mediums' &&
                  values.mediums?.map((medium: string) => {
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
              <Typography variant="h5">Choose Purposes</Typography>
              <div>
                {openedSection !== 'purposes' &&
                  values.purposes?.map((purpose: string) => {
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
              <Typography variant="h5">Choose Methodology</Typography>
              <div>
                {methodology && openedSection !== 'methodology' && (
                  <ToggleButton selected value={methodology}>
                    {methodologyButtonText}
                  </ToggleButton>
                )}
              </div>
            </AccordionSummary>
            <RadioField {...props} required={false}>
              <AccordionDetails className={classes.accordionSection}>
                <Typography variant="h6">Written</Typography>
                <div className={classes.buttonListWrapper}>
                  {['Paratext', 'OtherWritten'].map((option) => (
                    <RadioOption
                      key={option}
                      label={startCase(option)}
                      value={option}
                    />
                  ))}
                </div>
                <Typography variant="h6">Oral Translation</Typography>
                <div className={classes.buttonListWrapper}>
                  {['Render', 'OtherOralTranslation'].map((option) => (
                    <RadioOption
                      key={option}
                      label={startCase(option)}
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
                    <RadioOption
                      key={option}
                      label={startCase(option)}
                      value={option}
                    />
                  ))}
                </div>
                <Typography variant="h6">Visual</Typography>
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

      <SubmitButton fullWidth={false} color="primary" size="medium">
        Submit
      </SubmitButton>
      <Dialog open={Boolean(values.book)}>
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
                'book',
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
                'book',
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
};
