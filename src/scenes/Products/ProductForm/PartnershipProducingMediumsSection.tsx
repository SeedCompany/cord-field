import { List, ListItem, Typography } from '@mui/material';
import { ProductMedium, ProductMediumLabels } from '~/api/schema.graphql';
import { AutocompleteField } from '../../../components/form';
import { PartnershipForLabelFragment } from '../Detail/ProductDetail.graphql';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion } from './SecuredAccordion';

declare module './ProductForm' {
  interface ProductFormCustomValues {
    producingMediums?: {
      [K in ProductMedium]?: PartnershipForLabelFragment | null;
    };
  }
}

export const PartnershipProducingMediumsSection = ({
  engagement,
  values,
  accordionState,
}: SectionProps) => {
  if (!engagement.partnershipsProducingMediums.canRead) {
    return null;
  }

  return (
    <SecuredAccordion
      {...accordionState}
      title="Partners Producing these Distribution Methods"
      name="mediums"
      renderCollapsed={() => (
        <List disablePadding>
          {values.mediums
            ?.filter((medium) => values.producingMediums?.[medium])
            .map((medium) => (
              <ListItem key={medium}>
                <Typography>{ProductMediumLabels[medium]}</Typography>
                <Typography variant="caption" color="textSecondary">
                  &nbsp;via&nbsp;
                </Typography>
                <Typography>
                  {
                    values.producingMediums![medium]!.partner.value
                      ?.organization.value?.name.value
                  }
                </Typography>
              </ListItem>
            ))}
        </List>
      )}
    >
      {() => (
        <>
          <Typography paragraph>
            Pick the partners that are producing each distribution method
            <br />
            Note that these are <b>shared</b> across all goals for the
            engagement
          </Typography>
          {values.mediums?.map((medium) => (
            <AutocompleteField
              key={medium}
              name={`producingMediums.${medium}`}
              disabled={!engagement.partnershipsProducingMediums.canEdit}
              label={ProductMediumLabels[medium]}
              options={engagement.project.partnerships.items}
              getOptionLabel={(partnership: PartnershipForLabelFragment) =>
                partnership.partner.value?.organization.value?.name.value ??
                'Redacted'
              }
              compareBy={(partnership) => partnership.id}
              getOptionDisabled={(partnership) =>
                !partnership.partner.value?.organization.value?.name.value
              }
              autoComplete
              autoHighlight
              openOnFocus
            />
          ))}
        </>
      )}
    </SecuredAccordion>
  );
};
