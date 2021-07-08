import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { ToggleButton } from '@material-ui/lab';
import { difference, intersection, isEqual, startCase } from 'lodash';
import React, {
  ComponentType,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
  displayProductStep,
  displayProductTypes,
  MethodologyStep,
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
  SecuredEditableKeys,
  SecuredField,
  SecuredFieldRenderProps,
  SubmitAction,
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
import {
  AvailableMethodologyStepsFragment as AvailableMethodologySteps,
  ProductForm_DerivativeScriptureProduct_Fragment as DerivativeScriptureProduct,
  ProductForm_DirectScriptureProduct_Fragment as DirectScriptureProduct,
  ProductFormFragment,
} from './ProductForm.generated';
import {
  StepEditDialog,
  StepFormState,
  StepFormValues,
} from './StepEditDialog';
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

type AnyFormFieldComponent = ComponentType<FieldConfig<any, any, any>>;

const productFieldMap: Partial<Record<ProductTypes, AnyFormFieldComponent>> = {
  Film: FilmField,
  Story: StoryField,
  LiteracyMaterial: LiteracyMaterialField,
  Song: SongField,
};

export interface ProductFormValues extends SubmitAction<'delete'> {
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
      productSteps?: StepFormState[];
      stepNames?: MethodologyStep[];
    }
  >;
}

export interface ScriptureFormValues {
  book: string;
  updatingScriptures: ScriptureRange[];
}

type Product = UnionToIntersection<ProductFormFragment>;

type ProductKey = string &
  (
    | SecuredEditableKeys<DirectScriptureProduct>
    | Omit<SecuredEditableKeys<DerivativeScriptureProduct>, 'producesId'>
    | 'produces'
  );

export const AccordionSection = ({
  values,
  form,
  product,
  touched,
  methodologyAvailableSteps,
}: Except<FormRenderProps<ProductFormValues>, 'handleSubmit'> & {
  product?: ProductFormFragment;
  methodologyAvailableSteps?: readonly AvailableMethodologySteps[];
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
    stepNames,
    productSteps,
  } = (values as Partial<ProductFormValues>).product ?? {};

  const [previousSelectedSteps, setPreviousSelectedSteps] = useState<
    MethodologyStep[]
  >(stepNames || []);

  const availableStepsList = useMemo(
    () =>
      methodologyAvailableSteps?.find((s) => s.methodology === methodology)
        ?.steps,
    [methodology, methodologyAvailableSteps]
  );

  const [openedSection, setOpenedSection] = useState<ProductKey | undefined>(
    isEditing ? undefined : 'produces'
  );
  const accordionState = {
    openedSection,
    onOpen: setOpenedSection,
    product: productObj,
  };

  const [scriptureForm, openScriptureForm, scriptureInitialValues] =
    useDialog<ScriptureFormValues>();

  const [stepEditForm, openStepEditForm, stepEditInitialValues] =
    useDialog<StepFormValues>();

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
    !produces &&
    (touched?.['product.produces'] !== undefined ||
      !touched?.['product.produces']);

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

  const producesAccordian = (
    <SecuredAccordion
      {...accordionState}
      name="produces"
      product={isProducesFieldMissing ? undefined : productObj}
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
          {isProducesFieldMissing && !isEditing && (
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
  );

  const selectedSteps = useMemo(
    () => intersection(availableStepsList, stepNames),
    [availableStepsList, stepNames]
  );

  useEffect(() => {
    const newSteps = difference(stepNames, previousSelectedSteps);
    if (newSteps[0]) {
      const existingStepFormValue = productSteps?.find(
        (s) => s.step === newSteps[0]
      );
      openStepEditForm({
        step: newSteps[0],
        percentDone: existingStepFormValue?.percentDone,
        isCompletedStep: newSteps[0] === 'Completed',
        description: product?.describeCompletion.value?.toString(),
      });
    }
    if (!isEqual(stepNames, previousSelectedSteps)) {
      setPreviousSelectedSteps(stepNames || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openStepEditForm, stepNames, productSteps, product]);

  const updateProductDescription = useCallback(
    (newStepValues: StepFormValues) => {
      const productFormValue = form.getState().values.product;
      if (newStepValues.step === 'Completed') {
        form.change('product', {
          ...productFormValue,
          describeCompletion: newStepValues.description,
        });
      }

      let newProductSteps: StepFormState[];
      if (
        productFormValue.productSteps?.find(
          (s) => s.step === newStepValues.step
        )
      ) {
        newProductSteps = productFormValue.productSteps.map((s) =>
          s.step === newStepValues.step
            ? {
                step: s.step,
                percentDone: newStepValues.percentDone,
              }
            : s
        );
      } else {
        newProductSteps = [
          ...(productFormValue.productSteps || []),
          {
            step: newStepValues.step,
            percentDone: newStepValues.percentDone,
          },
        ];
      }
      form.change('product', {
        ...form.getState().values.product,
        productSteps: newProductSteps,
      });
    },
    [form]
  );

  return (
    <>
      <div className={classes.accordionContainer}>
        {producesAccordian}
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
                        selected={
                          Boolean(matchingArr.length) || fullOldTestament
                        }
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
              {entries(ApproachMethodologies).map(
                ([approach, methodologies]) => (
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
                )
              )}
            </EnumField>
          )}
        </SecuredAccordion>
        {availableStepsList && (
          <StepAccordion
            {...accordionState}
            name="Steps"
            renderCollapsed={() =>
              selectedSteps.map((step) => (
                <ToggleButton selected key={step} value={step}>
                  {displayProductStep(step)}
                </ToggleButton>
              ))
            }
          >
            <EnumField
              multiple
              name="stepNames"
              options={availableStepsList}
              getLabel={displayProductStep}
              variant="toggle-split"
            />
          </StepAccordion>
        )}
        {scriptureInitialValues && (
          <VersesDialog
            {...scriptureForm}
            {...scriptureInitialValues}
            currentScriptureReferences={scriptureReferences}
            onSubmit={onVersesFieldSubmit}
          />
        )}
      </div>
      {stepEditInitialValues && (
        <StepEditDialog
          {...stepEditInitialValues}
          {...stepEditForm}
          onSubmit={(step) => {
            updateProductDescription({
              ...step,
              percentDone: step.percentDone
                ? Number(step.percentDone)
                : undefined,
            });
          }}
        />
      )}
    </>
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
    <SecuredField
      obj={product}
      // @ts-expect-error yes produces key doesn't match convention of ID suffix
      name={name}
    >
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

const StepAccordion = <K extends ProductKey>({
  name,
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
  children: ReactNode;
}) => {
  const classes = useStyles();
  const isOpen = openedSection === name;
  return (
    <Accordion
      expanded={isOpen}
      onChange={(event, isExpanded) => {
        onOpen(isExpanded ? name : undefined);
      }}
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
        {children}
      </AccordionDetails>
    </Accordion>
  );
};
