import { useEffect } from 'react';
import { Except } from 'type-fest';
import { CreateOrganization } from '~/api/schema.graphql';
import { DialogFormProps } from '~/components/Dialog/DialogForm';
import { OrganizationLookupItem } from '~/components/form/Lookup';

const draftPrefix = 'draft:';

function createDraftOrganization(name: string): OrganizationLookupItem {
  return {
    __typename: 'Organization',
    id: `${draftPrefix}${name}`,
    name: { __typename: 'SecuredString', value: name },
  };
}

export const isDraftOrganization = (org: OrganizationLookupItem) =>
  org.id.startsWith(draftPrefix);

type DeferredCreateOrganizationProps = Except<
  DialogFormProps<CreateOrganization, OrganizationLookupItem>,
  'onSubmit'
>;

/**
 * Stands in for the Create Organization dialog in the lookup field.
 *
 * Renders nothing. A new name is handed back as a draft organization,
 * which the Create Partner submit creates.
 */
export function DeferredCreateOrganization({
  open,
  form,
  onClose,
  initialValues,
  onSuccess,
}: DeferredCreateOrganizationProps) {
  useEffect(() => {
    if (!open) {
      return;
    }
    // The lookup field passes no form. Callbacks ignore it.
    const noForm = form!;
    onSuccess?.(createDraftOrganization(initialValues?.name ?? ''), noForm);
    onClose?.('success', noForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return null;
}
