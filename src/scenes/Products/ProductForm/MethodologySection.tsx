import { Box, ToggleButton, Typography } from '@mui/material';
import { ProductApproachLabels } from '~/api/schema.graphql';
import {
  ApproachMethodologies,
  displayMethodology,
  displayMethodologyWithLabel,
  entries,
} from '~/common';
import { EnumField, EnumOption } from '../../../components/form';
import { sectionStyle } from './DefaultAccordion';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion } from './SecuredAccordion';

export const MethodologySection = ({
  values,
  accordionState,
}: SectionProps) => {
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
            <Box key={approach} sx={sectionStyle}>
              <Typography sx={{ fontWeight: 'bold' }}>
                {ProductApproachLabels[approach]}
              </Typography>
              {methodologies.map((option) => (
                <EnumOption
                  key={option}
                  label={displayMethodology(option)}
                  value={option}
                />
              ))}
            </Box>
          ))}
        </EnumField>
      )}
    </SecuredAccordion>
  );
};
