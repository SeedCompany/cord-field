import { List, ListItem, Typography } from '@material-ui/core';
import React from 'react';
import { displayProductMedium, ProductMedium } from '../../../api';
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
          {values.product?.mediums
            ?.filter((medium) => values.product?.producingMediums?.[medium])
            .map((medium) => (
              <ListItem key={medium}>
                <Typography>{displayProductMedium(medium)}</Typography>
                <Typography variant="caption" color="textSecondary">
                  &nbsp;via&nbsp;
                </Typography>
                <Typography>
                  {
                    values.product!.producingMediums![medium]!.partner.value
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
          {values.product?.mediums?.map((medium) => (
            <AutocompleteField
              key={medium}
              name={`producingMediums.${medium}`}
              disabled={!engagement.partnershipsProducingMediums.canEdit}
              label={displayProductMedium(medium)}
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
