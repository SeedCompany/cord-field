import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { useToggle } from 'ahooks';
import { ChildrenProp } from '~/common';
import { VariantFragment } from '~/common/fragments';
import { RoleIcon } from '~/components/RoleIcon';

export interface VariantAccordionProps extends ChildrenProp {
  variant: VariantFragment;
  expanded?: boolean;
}

export const VariantAccordion = ({
  variant,
  expanded: expandedInput,
  children,
}: VariantAccordionProps) => {
  const [expanded, { toggle }] = useToggle(expandedInput ?? false);

  return (
    <Accordion expanded={expanded} elevation={2} square>
      <AccordionSummary
        aria-controls={`${variant.key}-content`}
        expandIcon={<ExpandMore />}
        sx={{
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
          },
        }}
        onClick={toggle}
      >
        <RoleIcon variantRole={variant.responsibleRole} />
        <span>{variant.label}</span>
      </AccordionSummary>

      <AccordionDetails sx={{ px: 4 }}>{children}</AccordionDetails>
    </Accordion>
  );
};
