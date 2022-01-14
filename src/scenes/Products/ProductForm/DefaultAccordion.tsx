import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { startCase } from 'lodash';
import React, { ReactNode, useEffect } from 'react';
import { Except } from 'type-fest';
import { ProductKey } from './ProductFormFields';

export const useStyles = makeStyles(({ spacing, typography }) => ({
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
}));

export interface DefaultAccordionProps<K extends ProductKey> {
  name: K;
  errors?: any;
  openedSection: ProductKey | undefined;
  onOpen: (name: K | undefined) => void;
  title?: ReactNode | ((isOpen: boolean) => ReactNode);
  renderCollapsed: () => ReactNode;
  children: ReactNode;
  AccordionProps?: Except<AccordionProps, 'expanded' | 'onChange' | 'children'>;
}

export const DefaultAccordion = <K extends ProductKey>({
  name,
  errors,
  openedSection,
  onOpen,
  title,
  renderCollapsed,
  children,
  AccordionProps,
}: DefaultAccordionProps<K>) => {
  const isOpen = openedSection === name;
  const classes = useStyles();

  useEffect(() => {
    if (errors?.[name]) {
      onOpen(name);
    }
  }, [errors, name, onOpen]);

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
        classes={{ content: classes.accordionSummary }}
      >
        {typeof title === 'function' ? (
          title(isOpen)
        ) : (
          <Typography variant="h4">
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
