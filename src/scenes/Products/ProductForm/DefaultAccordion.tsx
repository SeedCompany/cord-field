import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import { FormState } from 'final-form';
import { get, startCase } from 'lodash';
import { ReactNode } from 'react';
import { Except } from 'type-fest';
import { useFieldName } from '../../../components/form';
import { ProductKey } from './ProductFormFields';

export const sectionStyle = {
  '&:not(:last-child)': {
    mb: 2,
  },
};

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
  openedSection,
  onOpen,
  title,
  renderCollapsed,
  children,
  AccordionProps,
}: DefaultAccordionProps<K>) => {
  const fullName = useFieldName(name);
  const isError = !!get(errors, fullName);
  const isTouched = !!get(touched, fullName);
  const isSubmitError = !!get(submitErrors, fullName);
  const isDirtySinceLastSubmit = !!get(dirtyFieldsSinceLastSubmit, fullName);
  const hasAnyError = (isSubmitError && !isDirtySinceLastSubmit) || isError;
  const showError = hasAnyError && isTouched;
  const isOpen = openedSection === name || hasAnyError;

  return (
    <Accordion
      {...AccordionProps}
      expanded={isOpen}
      onChange={(event, isExpanded) => {
        if (isExpanded) {
          onOpen(name);
        } else if (!hasAnyError) {
          // Only allow closing if there is no error
          onOpen(undefined);
        }
      }}
      // If there is an error and this section is clicked, mark it is the open
      // one so that it doesn't close unexpectedly when the field becomes valid
      onClick={() => hasAnyError && onOpen(name)}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={[
          {
            '& 	.MuiAccordionSummary-content': { flexDirection: 'column' },
          },
          showError && {
            color: 'error.main',
          },
        ]}
      >
        {typeof title === 'function' ? (
          title(isOpen)
        ) : (
          <Typography variant="h4" color="inherit">
            {isOpen && 'Choose '}
            {title ?? startCase(name)}
          </Typography>
        )}
        <Box sx={{ my: 0, mx: -1 }}>{isOpen ? null : renderCollapsed()}</Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
};
