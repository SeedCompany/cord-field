import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { startCase } from 'lodash';
import React, { ReactNode } from 'react';
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

export const DefaultAccordion = <K extends ProductKey>({
  name,
  openedSection,
  onOpen,
  title,
  renderCollapsed,
  children,
}: {
  name: K;
  openedSection: ProductKey | undefined;
  onOpen: (name: K | undefined) => void;
  title?: ReactNode | ((isOpen: boolean) => ReactNode);
  renderCollapsed: () => ReactNode;
  children: ReactNode;
}) => {
  const isOpen = openedSection === name;
  const classes = useStyles();

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
