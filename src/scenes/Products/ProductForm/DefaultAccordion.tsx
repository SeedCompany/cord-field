import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import clsx from 'clsx';
import { FormState } from 'final-form';
import { get, startCase } from 'lodash';
import React, { ReactNode, useEffect } from 'react';
import { Except } from 'type-fest';
import { useFieldName } from '../../../components/form';
import { ProductKey } from './ProductFormFields';

export const useStyles = makeStyles(({ spacing, typography, palette }) => ({
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
  accordionSummary: {
    flexDirection: 'column',
  },
  accordionSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  error: {
    color: palette.error.main,
  },
}));

export type DefaultAccordionProps<K extends ProductKey> = {
  name: K;
  openedSection: ProductKey | undefined;
  onOpen: (name: K | undefined) => void;
  title?: ReactNode | ((isOpen: boolean) => ReactNode);
  renderCollapsed: () => ReactNode;
  children: ReactNode;
  AccordionProps?: Except<AccordionProps, 'expanded' | 'onChange' | 'children'>;
} & FormState<any>;

export const DefaultAccordion = <K extends ProductKey>({
  name,
  submitErrors,
  dirtyFieldsSinceLastSubmit,
  errors,
  touched,
  submitFailed,
  openedSection,
  onOpen,
  title,
  renderCollapsed,
  children,
  AccordionProps,
}: DefaultAccordionProps<K>) => {
  const isOpen = openedSection === name;
  const classes = useStyles();
  const fullName = useFieldName(name);
  const isError = !!get(errors, fullName);
  const isTouched = !!get(touched, fullName);
  const isSubmitError = !!get(submitErrors, fullName);
  const isDirtySinceLastSubmit = !!get(dirtyFieldsSinceLastSubmit, fullName);
  const showError =
    ((isSubmitError && !isDirtySinceLastSubmit) || isError) && isTouched;

  useEffect(() => {
    if (showError && submitFailed) {
      onOpen(name);
    }
  }, [showError, submitFailed, name, onOpen]);

  return (
    <Accordion
      {...AccordionProps}
      expanded={isOpen}
      onChange={(event, isExpanded) => {
        onOpen(isExpanded ? name : undefined);
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        classes={{
          content: clsx(
            classes.accordionSummary,
            showError ? classes.error : undefined
          ),
        }}
      >
        {typeof title === 'function' ? (
          title(isOpen)
        ) : (
          <Typography variant="h4" color="inherit">
            {isOpen && 'Choose '}
            {title ?? startCase(name)}
          </Typography>
        )}
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
