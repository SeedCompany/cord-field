import { EntityListItem, rowSecondary } from '../List';
import { PartnerColumns } from './PartnerColumns';
import { PartnerDataGridRowFragment as Partner } from './partnerDataGridRow.graphql';

const SORT_DEFAULT = 'organization.name';

/**
 * Renders a partner as a mobile {@link EntityListItem}: the primary is the acronym
 * (falling back to the full name), so on the default sort the labeled name is
 * only shown as the secondary when an acronym occupies the primary — otherwise
 * it would just repeat the name. Used by the partner list and the user→partners
 * tab via {@link EntityList}'s `renderItem`.
 */
export const renderPartnerRow = (
  partner: Partner,
  sort: string | undefined
) => {
  const org = partner.organization.value;
  const acronym = org?.acronym.value?.trim() || undefined;
  const name = org?.name.value;
  return (
    <EntityListItem
      to={`/partners/${partner.id}`}
      primary={acronym ?? name}
      secondary={
        sort !== SORT_DEFAULT || acronym
          ? rowSecondary(
              PartnerColumns,
              sort,
              SORT_DEFAULT,
              SORT_DEFAULT,
              partner
            )
          : undefined
      }
    />
  );
};
