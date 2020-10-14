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
import { Except, Merge, UnionToIntersection } from 'type-fest';
import {
  ApproachMethodologies,
  CreateProduct,
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
  UpdateProduct,
} from '../../../api';
import { useDialog } from '../../../components/Dialog';
import {
  EnumField,
  EnumOption,
  FieldConfig,
  SecuredField,
  SecuredFieldRenderProps,
  SecuredKeys,
} from '../../../components/form';
import {
  FilmField,
  FilmLookupItem,
  LiteracyMaterialField,
  LiteracyMaterialLookupItem,
  SongField,
  SongLookupItem,
  StoryField,
  StoryLookupItem,
} from '../../../components/form/Lookup';
import { SwitchField } from '../../../components/form/SwitchField';
import { entries } from '../../../util';
import {
  filterScriptureRangesByTestament,
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

const useStyles = makeStyles(({ spacing, typography, breakpoints }) => ({
  accordionContainer: {
    maxWidth: breakpoints.values.md,
  },
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

export interface ProductFormValues {
  product: Merge<
    Except<CreateProduct & UpdateProduct, 'id' | 'engagementId'>,
    {
      productType?: ProductTypes;
      produces?:
        | FilmLookupItem
        | StoryLookupItem
        | LiteracyMaterialLookupItem
        | SongLookupItem;
      scriptureReferences?: readonly ScriptureRange[];
      fullOldTestament?: boolean;
      fullNewTestament?: boolean;
    }
  >;
}

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
  touched,
}: Except<FormRenderProps<ProductFormValues>, 'handleSubmit'> & {
  product?: ProductFormFragment;
}) => {
  const productObj = product as Product | undefined;
  const classes = useStyles();
  const isEditing = Boolean(productObj);
  const {
    productType,
    methodology,
    produces,
    scriptureReferences,
    mediums,
    purposes,
    fullOldTestament,
    fullNewTestament,
  } = (values as Partial<ProductFormValues>).product ?? {};

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

  const isProducesFieldMissing = !produces && touched?.['product.produces'];

  const onVersesFieldSubmit = ({
    updatingScriptures,
    fullBook,
  }: versesDialogValues) => {
    scriptureInitialValues &&
      form.change(
        // @ts-expect-error this is a valid field key
        'product.scriptureReferences',
        mergeScriptureRange(
          updatingScriptures,
          scriptureReferences,
          scriptureInitialValues.book,
          fullBook
        )
      );
  };

  return (
    <div className={classes.accordionContainer}>
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
            <EnumField
              name="productType"
              disabled={isEditing}
              options={productTypes}
              getLabel={displayProductTypes}
              defaultValue="DirectScriptureProduct"
              required
              variant="toggle-split"
            />
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
          <EnumField
            multiple
            options={ProductMediumList}
            getLabel={displayProductMedium}
            variant="toggle-split"
            {...props}
          />
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
          <EnumField
            multiple
            options={ProductPurposeList}
            getLabel={displayProductPurpose}
            variant="toggle-split"
            {...props}
          />
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
          <EnumField layout="column" {...props}>
            {entries(ApproachMethodologies).map(([approach, methodologies]) => (
              <div key={approach} className={classes.section}>
                <Typography className={classes.label}>
                  {displayApproach(approach)}
                </Typography>
                {methodologies.map((option) => (
                  <EnumOption
                    key={option}
                    label={displayMethodology(option)}
                    value={option}
                  />
                ))}
              </div>
            ))}
          </EnumField>
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
