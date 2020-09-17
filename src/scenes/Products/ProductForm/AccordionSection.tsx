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
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { FormRenderProps } from 'react-final-form';
import { useNavigate } from 'react-router';
import {
  displayMethodology,
  displayMethodologyWithLabel,
  displayProductMedium,
  displayProductPurpose,
  displayProductTypes,
  GQLOperations,
  ProductMedium,
  ProductMethodology,
  ProductPurpose,
} from '../../../api';
import { ErrorButton } from '../../../components/ErrorButton';
import {
  FieldGroup,
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
import { VersesField } from '../../../components/form/VersesField';
import { entries } from '../../../util';
import {
  getScriptureRangeDisplay,
  matchingScriptureRanges,
  mergeScriptureRange,
  scriptureRangeDictionary,
} from '../../../util/biblejs';
import { newTestament, oldTestament, productTypes } from './constants';
import { getIsDerivativeProduct } from './helpers';
import {
  ProductFormFragment,
  useDeleteProductMutation,
} from './ProductForm.generated';

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
    '& h4': {
      marginBottom: spacing(1),
    },
  },
  dialog: {
    width: 400,
  },
  dialogText: {
    margin: spacing(1, 0),
  },
  deleteButton: {
    marginLeft: spacing(1),
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
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [deleteProduct] = useDeleteProductMutation({
    awaitRefetchQueries: true,
    refetchQueries: [GQLOperations.Query.Engagement],
  });

  const isEditing = Boolean(productObj);

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<Record<string, unknown>>,
    isExpanded: boolean
  ) => {
    setOpenedSection(isExpanded ? panel : '');
  };

  const handleDelete = async () => {
    productObj &&
      (await deleteProduct({
        variables: {
          productId: productObj.id,
        },
      }));

    enqueueSnackbar(`Product deleted`, {
      variant: 'success',
    });

    navigate('../../');
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

  const isProducesFieldMissing =
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
            <Typography variant="h4">
              {openedSection === 'produces' && 'Choose '}Product
            </Typography>
            <div className={classes.accordionSummaryButtonsContainer}>
              {productType && openedSection !== 'produces' && (
                <ToggleButton selected value={produces || ''}>
                  {`${displayProductTypes(productType)} ${
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
              onChange={handleChange('scriptureReferences')}
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
                  {oldTestament.map((option) => {
                    const matchingArr = matchingScriptureRanges(
                      option,
                      scriptureReferences
                    );
                    return (
                      <ToggleButton
                        key={option}
                        value={option}
                        selected={Boolean(matchingArr.length)}
                        disabled={disabled}
                        onClick={() => {
                          form.change('updatingScriptures', matchingArr);
                          setSelectedBook(option);
                        }}
                      >
                        {getScriptureRangeDisplay(matchingArr, option)}
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
                    const matchingArr = matchingScriptureRanges(
                      option,
                      scriptureReferences
                    );
                    return (
                      <ToggleButton
                        key={option}
                        value={option}
                        selected={Boolean(matchingArr.length)}
                        disabled={disabled}
                        onClick={() => {
                          form.change('updatingScriptures', matchingArr);
                          setSelectedBook(option);
                        }}
                      >
                        {getScriptureRangeDisplay(matchingArr, option)}
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
                  {([
                    'Print',
                    'Web',
                    'EBook',
                    'App',
                    'Audio',
                    'OralTranslation',
                    'Video',
                    'Other',
                  ] as ProductMedium[]).map((option) => {
                    return (
                      <ToggleButtonOption
                        key={option}
                        label={displayProductMedium(option)}
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
                  {([
                    'EvangelismChurchPlanting',
                    'ChurchLife',
                    'ChurchMaturity',
                    'SocialIssues',
                    'Discipleship',
                  ] as ProductPurpose[]).map((option) => (
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
              onChange={handleChange('methodology')}
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
                  <Typography>Written</Typography>
                  <div className={classes.buttonListWrapper}>
                    {(['Paratext', 'OtherWritten'] as ProductMethodology[]).map(
                      (option) => (
                        <RadioOption
                          key={option}
                          label={displayMethodology(option)}
                          value={option}
                        />
                      )
                    )}
                  </div>
                  <Typography>Oral Translation</Typography>
                  <div className={classes.buttonListWrapper}>
                    {([
                      'Render',
                      'OtherOralTranslation',
                    ] as ProductMethodology[]).map((option) => (
                      <RadioOption
                        key={option}
                        label={displayMethodology(option)}
                        value={option}
                      />
                    ))}
                  </div>
                  <Typography>Oral Stories</Typography>
                  <div className={classes.buttonListWrapper}>
                    {([
                      'BibleStories',
                      'BibleStorying',
                      'OneStory',
                      'OtherOralStories',
                    ] as ProductMethodology[]).map((option) => (
                      <RadioOption
                        key={option}
                        label={displayMethodology(option)}
                        value={option}
                      />
                    ))}
                  </div>
                  <Typography>Visual</Typography>
                  <div className={classes.buttonListWrapper}>
                    {([
                      'Film',
                      'SignLanguage',
                      'OtherVisual',
                    ] as ProductMethodology[]).map((option) => (
                      <RadioOption
                        key={option}
                        label={displayMethodology(option)}
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
          If the selections above look good to you, go ahead and save your
          Product. If you need to edit your choices, do that above.
        </Typography>
      </div>
      <SubmitButton fullWidth={false} color="primary" size="medium">
        Save Product
      </SubmitButton>
      {isEditing && (
        <ErrorButton
          fullWidth={false}
          size="medium"
          onClick={handleDelete}
          className={classes.deleteButton}
        >
          Delete Product
        </ErrorButton>
      )}
      <Dialog open={Boolean(selectedBook)}>
        <DialogTitle>{selectedBook}</DialogTitle>
        <DialogContent className={classes.dialog}>
          <Typography variant="h4" className={classes.dialogText}>
            Choose Your Chapters
          </Typography>
          <Typography className={classes.dialogText}>
            When choosing chapters and verses, you can make multiple selections.
            Input your wanted chapter/s and verses to create multiple
            selections.
          </Typography>
          <VersesField book={selectedBook} name="updatingScriptures" />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSelectedBook('');
              form.change('updatingScriptures', undefined);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              form.change(
                'product.scriptureReferences',
                mergeScriptureRange(
                  values.updatingScriptures,
                  scriptureReferences,
                  selectedBook
                )
              );
              form.change('updatingScriptures', undefined);
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
