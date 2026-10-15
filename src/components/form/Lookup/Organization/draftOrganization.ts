import { createForm } from 'final-form';
import { noop } from 'lodash';
import { useEffect } from 'react';
import { Except } from 'type-fest';
import { CreateOrganization as CreateOrganizationInput } from '~/api/schema.graphql';
import { DialogFormProps } from '../../../Dialog/DialogForm';
import { OrganizationLookupItemFragment } from './OrganizationLookup.graphql';

const draftOrginiazationPrefix = 'draft:';

/**
 * Creates a placeholder organization for a name that does not exist yet.
 */
export const draftOrganization = (
  name: string
): OrganizationLookupItemFragment => ({
  __typename: 'Organization',
  id: `${draftOrginiazationPrefix}${name}`,
  name: { __typename: 'SecuredString', value: name },
});

/**
 * Checks if an organization is a placeholder that must still be created.
 */
export const isDraftOrganization = (org: OrganizationLookupItemFragment) =>
  org.id.startsWith(draftOrginiazationPrefix);

type DraftOrganizationProps = Except<
  DialogFormProps<CreateOrganizationInput, OrganizationLookupItemFragment>,
  'onSubmit'
>;

/**
 * Create dialog replacement that skips the dialog and selects a draft organization.
 *
 * Renders nothing. Use as `CreateDialogForm` of an organization field.
 */
export const DraftOrganization = ({
  open,
  onClose,
  onSuccess,
  initialValues,
}: DraftOrganizationProps) => {
  const draftName = initialValues?.name;

  useEffect(() => {
    if (!open || !draftName) {
      return;
    }
    const form = createForm<CreateOrganizationInput>({ onSubmit: noop });
    onSuccess?.(draftOrganization(draftName), form);
    onClose?.('success', form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return null;
};
