import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { ToggleButton } from '@material-ui/lab';
import clsx from 'clsx';
import React, { Fragment, MouseEvent, useState } from 'react';
import { FormRenderProps } from 'react-final-form';
import { Except, UnionToIntersection } from 'type-fest';
import {
  ApproachMethodologies,
  displayApproach,
  displayMethodology,
  displayMethodologyWithLabel,
  displayProductMedium,
  displayProductPurpose,
  displayProductTypes,
  ProductMedium,
  ProductMediumList,
  ProductPurpose,
  ProductPurposeList,
} from '../../../api';
import { useDialog } from '../../../components/Dialog';
import {
  RadioField,
  RadioOption,
  SecuredField,
  ToggleButtonOption,
  ToggleButtonsField,
} from '../../../components/form';
import {
  FilmField,
  LiteracyMaterialField,
  SongField,
  StoryField,
} from '../../../components/form/Lookup';
import { entries } from '../../../util';
import {
  getScriptureRangeDisplay,
  matchingScriptureRanges,
  ScriptureRange,
  scriptureRangeDictionary,
} from '../../../util/biblejs';
import { newTestament, oldTestament, productTypes } from './constants';
import { ProductFormFragment } from './ProductForm.generated';
import { VersesDialog } from './VersesDialog';

const useStyles = makeStyles(({ spacing, typography }) => ({
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
}));

const productField = {
  Film: <FilmField name="produces" required />,
  Story: <StoryField name="produces" required />,
  LiteracyMaterial: <LiteracyMaterialField name="produces" required />,
  Song: <SongField name="produces" required />,
};
const getProductField = (productType: keyof typeof productField) =>
  productField[productType];

export interface ScriptureFormValues {
  book: string;
  updatingScriptures: ScriptureRange[];
}

type SectionKey = keyof UnionToIntersection<ProductFormFragment> | undefined;

export const AccordionSection = ({
  values,
  form,
  product: productObj,
}: Except<FormRenderProps<any>, 'handleSubmit'> & {
  product?: ProductFormFragment;
}) => {
  const classes = useStyles();
  const isEditing = Boolean(productObj);
  const {
    methodology,
    productType,
    produces,
    scriptureReferences,
    mediums,
    purposes,
  } = values.product;

  const [openedSection, setOpenedSection] = useState<SectionKey>(
    isEditing ? undefined : 'produces'
  );
  const [scriptureForm, openScriptureForm, scriptureInitialValues] = useDialog<
    ScriptureFormValues
  >();

  const openBook = (event: MouseEvent<HTMLButtonElement>) => {
    openScriptureForm({
      book: event.currentTarget.value,
      updatingScriptures: matchingScriptureRanges(
        event.currentTarget.value,
        scriptureReferences
      ),
    });
  };

  const openSection = (panel: SectionKey) => (
    event: React.ChangeEvent<Record<string, unknown>>,
    isExpanded: boolean
  ) => {
    setOpenedSection(isExpanded ? panel : undefined);
  };

  const isProducesFieldMissing =
    form.getFieldState('product.produces')?.error === 'Required';

  return (
    <div>
      {/* TODO: secure this accordion with name=produces */}
      <Accordion
        expanded={openedSection === 'produces'}
        onChange={openSection('produces')}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          classes={{ content: classes.accordionSummary }}
        >
          <Typography variant="h4">
            {openedSection === 'produces' && 'Choose '}Product
          </Typography>
          <div className={classes.accordionSummaryButtonsContainer}>
            {productType && openedSection !== 'produces' && (
              <ToggleButton selected value={produces || ''}>
                {`${displayProductTypes(productType)} ${
                  (productType !== 'DirectScriptureProduct' &&
                    produces?.name.value) ||
                  ''
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
        <RadioField
          name="productType"
          disabled={isEditing}
          defaultValue="DirectScriptureProduct"
        >
          <AccordionDetails className={classes.accordionSection}>
            <div>
              {productTypes.map((option) => (
                <RadioOption
                  key={option}
                  label={displayProductTypes(option)}
                  value={option}
                />
              ))}
            </div>
            {getProductField(productType)}
          </AccordionDetails>
        </RadioField>
      </Accordion>
      {/* //TODO: maybe include scriptureReferencesOverride in the name to show api field error */}
      <SecuredField obj={productObj} name="scriptureReferences">
        {({ disabled }) => (
          <Accordion
            expanded={openedSection === 'scriptureReferences'}
            onChange={openSection('scriptureReferences')}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              classes={{ content: classes.accordionSummary }}
            >
              <Typography variant="h4">
                {openedSection === 'scriptureReferences' && 'Choose '}
                Scripture
              </Typography>
              <div className={classes.accordionSummaryButtonsContainer}>
                {openedSection !== 'scriptureReferences' &&
                  entries(scriptureRangeDictionary(scriptureReferences)).map(
                    ([book, scriptureRange]) => (
                      <ToggleButton selected key={book} value={book}>
                        {getScriptureRangeDisplay(scriptureRange, book)}
                      </ToggleButton>
                    )
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
                {oldTestament.map((book) => {
                  const matchingArr = matchingScriptureRanges(
                    book,
                    scriptureReferences
                  );
                  return (
                    <ToggleButton
                      key={book}
                      value={book}
                      selected={Boolean(matchingArr.length)}
                      disabled={disabled}
                      onClick={openBook}
                    >
                      {getScriptureRangeDisplay(matchingArr, book)}
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
                {newTestament.map((book) => {
                  const matchingArr = matchingScriptureRanges(
                    book,
                    scriptureReferences
                  );
                  return (
                    <ToggleButton
                      key={book}
                      value={book}
                      selected={Boolean(matchingArr.length)}
                      disabled={disabled}
                      onClick={openBook}
                    >
                      {getScriptureRangeDisplay(matchingArr, book)}
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
            onChange={openSection('mediums')}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              classes={{ content: classes.accordionSummary }}
            >
              <Typography variant="h4">
                {openedSection === 'mediums' && 'Choose '}Medium
              </Typography>
              <div className={classes.accordionSummaryButtonsContainer}>
                {openedSection !== 'mediums' &&
                  mediums?.map((medium: ProductMedium) => {
                    return (
                      <ToggleButton selected key={medium} value={medium}>
                        {displayProductMedium(medium)}
                      </ToggleButton>
                    );
                  })}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <ToggleButtonsField {...props}>
                {ProductMediumList.map((option) => (
                  <ToggleButtonOption
                    key={option}
                    label={displayProductMedium(option)}
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
            onChange={openSection('purposes')}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              classes={{ content: classes.accordionSummary }}
            >
              <Typography variant="h4">
                {openedSection === 'purposes' && 'Choose '}Purposes
              </Typography>
              <div className={classes.accordionSummaryButtonsContainer}>
                {openedSection !== 'purposes' &&
                  purposes?.map((purpose: ProductPurpose) => {
                    return (
                      <ToggleButton selected key={purpose} value={purpose}>
                        {displayProductPurpose(purpose)}
                      </ToggleButton>
                    );
                  })}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <ToggleButtonsField {...props}>
                {ProductPurposeList.map((option) => (
                  <ToggleButtonOption
                    key={option}
                    label={displayProductPurpose(option)}
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
            onChange={openSection('methodology')}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              classes={{ content: classes.accordionSummary }}
            >
              <Typography variant="h4">
                {openedSection === 'methodology' && 'Choose '}Methodology
              </Typography>
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
                {entries(ApproachMethodologies).map(
                  ([approach, methodologies]) => (
                    <Fragment key={approach}>
                      <Typography>{displayApproach(approach)}</Typography>
                      <div className={classes.buttonListWrapper}>
                        {methodologies.map((option) => (
                          <RadioOption
                            key={option}
                            label={displayMethodology(option)}
                            value={option}
                          />
                        ))}
                      </div>
                    </Fragment>
                  )
                )}
              </AccordionDetails>
            </RadioField>
          </Accordion>
        )}
      </SecuredField>
      {scriptureInitialValues && (
        <VersesDialog
          {...scriptureForm}
          {...scriptureInitialValues}
          currentScriptureReferences={scriptureReferences}
          changeField={form.change}
        />
      )}
    </div>
  );
};
