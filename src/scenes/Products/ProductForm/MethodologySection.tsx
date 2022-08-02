import { Typography } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import { ProductApproachLabels } from '~/api/schema.graphql';
import {
  ApproachMethodologies,
  displayMethodology,
  displayMethodologyWithLabel,
  entries,
} from '~/common';
import { EnumField, EnumOption } from '../../../components/form';
import { useStyles } from './DefaultAccordion';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion } from './SecuredAccordion';

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
                {ProductApproachLabels[approach]}
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
