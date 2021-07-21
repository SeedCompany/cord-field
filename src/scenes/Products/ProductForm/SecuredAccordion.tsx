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
import {
  SecuredField,
  SecuredFieldRenderProps,
} from '../../../components/form';
import { Product, ProductKey } from './ProductFormFields';

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

export const SecuredAccordion = <K extends ProductKey>({
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
