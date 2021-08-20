import { Typography } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import React from 'react';
import {
  ApproachMethodologies,
  displayApproach,
  displayMethodology,
  displayMethodologyWithLabel,
} from '../../../api';
import { EnumField, EnumOption } from '../../../components/form';
import { entries } from '../../../util';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion, useStyles } from './SecuredAccordion';

export const MethodologySection = ({
  values,
  accordionState,
}: SectionProps) => {
  const classes = useStyles();
  const { methodology } = values.product ?? {};
  return (
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
  );
};
