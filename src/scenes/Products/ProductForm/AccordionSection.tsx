import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { ToggleButton } from '@material-ui/lab';
import { startCase } from 'lodash';
import React, { ComponentType, MouseEvent, ReactNode, useState } from 'react';
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
  FieldConfig,
  RadioField,
  RadioOption,
  SecuredField,
  SecuredFieldRenderProps,
  SecuredKeys,
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
  mergeScriptureRange,
  ScriptureRange,
  scriptureRangeDictionary,
} from '../../../util/biblejs';
import {
  newTestament,
  oldTestament,
  ProductTypes,
  productTypes,
} from './constants';
import { ProductFormFragment } from './ProductForm.generated';
import { VersesDialog, versesDialogValues } from './VersesDialog';

const useStyles = makeStyles(({ spacing, typography }) => ({
  accordionSummary: {
    flexDirection: 'column',
  },
  accordionSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    '&:not(:last-child)': {
      marginBottom: spacing(2),
    },
  },
  label: {
    fontWeight: typography.weight.bold,
  },
  toggleButtonContainer: {
    margin: spacing(0, -1),
  },
}));

const productFieldMap: Partial<Record<
  ProductTypes,
  ComponentType<FieldConfig<any> & { name: string }>
>> = {
  Film: FilmField,
  Story: StoryField,
  LiteracyMaterial: LiteracyMaterialField,
  Song: SongField,
};

export interface ScriptureFormValues {
  book: string;
  updatingScriptures: ScriptureRange[];
}

type Product = UnionToIntersection<ProductFormFragment>;

type ProductKey = SecuredKeys<Product>;

export const AccordionSection = ({
  values,
  form,
  product,
}: Except<FormRenderProps<any>, 'handleSubmit'> & {
  product?: ProductFormFragment;
}) => {
  const productObj = product as Product | undefined;
  const classes = useStyles();
  const isEditing = Boolean(productObj);
  const {
    methodology,
    produces,
    scriptureReferences,
    mediums,
    purposes,
  } = values.product;
  const productType = values.product.productType as ProductTypes | undefined;

  const [openedSection, setOpenedSection] = useState<ProductKey | undefined>(
    isEditing ? undefined : 'produces'
  );
  const accordionState = {
    openedSection,
    onOpen: setOpenedSection,
    product: productObj,
  };

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

  const isProducesFieldMissing =
    form.getFieldState('product.produces')?.error === 'Required';

  const onVersesFieldSubmit = ({ updatingScriptures }: versesDialogValues) => {
    scriptureInitialValues &&
      form.change(
        'product.scriptureReferences',
        mergeScriptureRange(
          updatingScriptures,
          scriptureReferences,
          scriptureInitialValues.book
        )
      );
  };

  return (
    <div>
      <SecuredAccordion
        {...accordionState}
        name="produces"
        title="Product"
        renderCollapsed={() => (
          <>
            {productType && (
              <ToggleButton selected value={produces || ''}>
                {`${displayProductTypes(productType)} ${
                  (productType !== 'DirectScriptureProduct' &&
                    produces?.name.value) ||
                  ''
                }`}
              </ToggleButton>
            )}
            {isProducesFieldMissing && (
              <Typography variant="caption" color="error">
                Product selection required
              </Typography>
            )}
          </>
        )}
      >
        {(props) => {
          const productTypeField = (
            <RadioField
              name="productType"
              disabled={isEditing}
              defaultValue="DirectScriptureProduct"
              row
            >
              {productTypes.map((option) => (
                <RadioOption
                  key={option}
                  label={displayProductTypes(option)}
                  value={option}
                />
              ))}
            </RadioField>
          );

          const ProductField = productType
            ? productFieldMap[productType]
            : undefined;
          const productField = ProductField && (
            <ProductField {...props} required />
          );

          return (
            <>
              {productTypeField}
              {productField}
            </>
          );
        }}
      </SecuredAccordion>
      {/* //TODO: maybe include scriptureReferencesOverride in the name to show api field error */}
      <SecuredAccordion
        {...accordionState}
        name="scriptureReferences"
        title="Scripture"
        renderCollapsed={() =>
          entries(scriptureRangeDictionary(scriptureReferences)).map(
            ([book, scriptureRange]) => (
              <ToggleButton selected key={book} value={book}>
                {getScriptureRangeDisplay(scriptureRange, book)}
              </ToggleButton>
            )
          )
        }
      >
        {({ disabled }) => (
          <>
            <div className={classes.section}>
              <Typography className={classes.label}>Old Testament</Typography>
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
                      selected={Boolean(matchingArr.length)}
                      disabled={disabled}
                      onClick={openBook}
                    >
                      {getScriptureRangeDisplay(matchingArr, book)}
                    </ToggleButton>
                  );
                })}
              </div>
            </div>
            <Typography className={classes.label}>New Testament</Typography>
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
                    selected={Boolean(matchingArr.length)}
                    disabled={disabled}
                    onClick={openBook}
                  >
                    {getScriptureRangeDisplay(matchingArr, book)}
                  </ToggleButton>
                );
              })}
            </div>
          </>
        )}
      </SecuredAccordion>
      <SecuredAccordion
        {...accordionState}
        name="mediums"
        renderCollapsed={() =>
          mediums?.map((medium: ProductMedium) => (
            <ToggleButton selected key={medium} value={medium}>
              {displayProductMedium(medium)}
            </ToggleButton>
          ))
        }
      >
        {(props) => (
          <ToggleButtonsField {...props}>
            {ProductMediumList.map((option) => (
              <ToggleButtonOption
                key={option}
                label={displayProductMedium(option)}
                value={option}
              />
            ))}
          </ToggleButtonsField>
        )}
      </SecuredAccordion>
      <SecuredAccordion
        {...accordionState}
        name="purposes"
        renderCollapsed={() =>
          purposes?.map((purpose: ProductPurpose) => (
            <ToggleButton selected key={purpose} value={purpose}>
              {displayProductPurpose(purpose)}
            </ToggleButton>
          ))
        }
      >
        {(props) => (
          <ToggleButtonsField {...props}>
            {ProductPurposeList.map((option) => (
              <ToggleButtonOption
                key={option}
                label={displayProductPurpose(option)}
                value={option}
              />
            ))}
          </ToggleButtonsField>
        )}
      </SecuredAccordion>
      <SecuredAccordion
        {...accordionState}
        name="methodology"
        renderCollapsed={() =>
          methodology && (
            <ToggleButton selected value={methodology}>
              {displayMethodologyWithLabel(methodology)}
            </ToggleButton>
          )
        }
      >
        {(props) => (
          <RadioField {...props} required={false}>
            {entries(ApproachMethodologies).map(([approach, methodologies]) => (
              <div key={approach} className={classes.section}>
                <Typography className={classes.label}>
                  {displayApproach(approach)}
                </Typography>
                {methodologies.map((option) => (
                  <RadioOption
                    key={option}
                    label={displayMethodology(option)}
                    value={option}
                  />
                ))}
              </div>
            ))}
          </RadioField>
        )}
      </SecuredAccordion>
      {scriptureInitialValues && (
        <VersesDialog
          {...scriptureForm}
          {...scriptureInitialValues}
          currentScriptureReferences={scriptureReferences}
          onSubmit={onVersesFieldSubmit}
        />
      )}
    </div>
  );
};

const SecuredAccordion = <K extends ProductKey>({
  name,
  product,
  openedSection,
  onOpen,
  title,
  renderCollapsed,
  children,
}: {
  name: K;
  product?: Product;
  openedSection: ProductKey | undefined;
  onOpen: (name: K | undefined) => void;
  title?: ReactNode;
  renderCollapsed: () => ReactNode;
  children: (props: SecuredFieldRenderProps<K>) => ReactNode;
}) => {
  const classes = useStyles();
  const isOpen = openedSection === name;

  return (
    <SecuredField obj={product} name={name}>
      {(fieldProps) => (
        <Accordion
          expanded={isOpen}
          onChange={(event, isExpanded) => {
            onOpen(isExpanded ? name : undefined);
          }}
          disabled={fieldProps.disabled}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            classes={{ content: classes.accordionSummary }}
          >
            <Typography variant="h4">
              {isOpen && 'Choose '}
              {title ?? startCase(name)}
            </Typography>
            <div className={classes.toggleButtonContainer}>
              {isOpen ? null : renderCollapsed()}
            </div>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionSection}>
            {children(fieldProps)}
          </AccordionDetails>
        </Accordion>
      )}
    </SecuredField>
  );
};
