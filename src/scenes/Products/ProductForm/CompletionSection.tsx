import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { TextField } from '../../../components/form';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion } from './SecuredAccordion';

const useStyles = makeStyles(({ spacing }) => ({
  collapsed: {
    marginLeft: spacing(1),
    marginTop: spacing(1),
  },
}));

export const CompletionSection = ({ values, accordionState }: SectionProps) => {
  const classes = useStyles();

  if (!values.product?.methodology) {
    return null;
  }

  return (
    <SecuredAccordion
      {...accordionState}
      name="describeCompletion"
      title={() => <Typography variant="h4">Completion Description</Typography>}
      renderCollapsed={() => (
        <Typography className={classes.collapsed}>
          {values.product?.describeCompletion}
        </Typography>
      )}
    >
      {(props) => <TextField label="Completion means..." {...props} />}
    </SecuredAccordion>
  );
};
