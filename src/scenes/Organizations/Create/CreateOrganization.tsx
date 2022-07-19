import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { Except } from 'type-fest';
import {
  CreateOrganizationDocument,
  CreateOrganizationMutation,
} from './CreateOrganization.graphql';
import {
  CreateOrganizationForm,
  CreateOrganizationFormProps,
} from './CreateOrganizationForm';

type SubmitResult =
  CreateOrganizationMutation['createOrganization']['organization'];
type CreateOrganizationProps = Except<
  CreateOrganizationFormProps<SubmitResult>,
  'onSubmit'
>;

export const CreateOrganization = (props: CreateOrganizationProps) => {
  const [createOrg] = useMutation(CreateOrganizationDocument);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <CreateOrganizationForm<SubmitResult>
      onSuccess={(org) =>
        enqueueSnackbar(`Created organization: ${org.name.value}`, {
          variant: 'success',
        })
      }
      {...props}
      onSubmit={async (input) => {
        const { data } = await createOrg({
          variables: { input },
        });
        return data!.createOrganization.organization;
      }}
    />
  );
};
