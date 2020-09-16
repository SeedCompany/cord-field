import { GQLOperations } from '../../../api';
import {
  CreateFileVersionMutation,
  useCreateFileVersionMutation,
} from '../../../components/files/FileActions';
import {
  HandleUploadCompletedFunction,
  UploadFilesConsumerFunction,
  UploadFilesConsumerInput,
  useUploadFiles,
} from '../../../components/files/hooks';
import { updateCachedVersions } from '../../../components/files/updateCachedVersions';
import { useUpdateProjectBudgetUniversalTemplateMutation } from '../Budget/ProjectBudget.generated';

export const useUploadProjectFiles = (): UploadFilesConsumerFunction => {
  const uploadFiles = useUploadFiles();
  const [createFileVersion] = useCreateFileVersionMutation();

  const handleUploadCompleted: HandleUploadCompletedFunction = async ({
    uploadId,
    name,
    parentId,
    action,
  }) => {
    const input = {
      uploadId,
      name,
      parentId,
    };
    await createFileVersion({
      variables: { input },
      refetchQueries:
        action === 'file' ? [GQLOperations.Query.ProjectDirectory] : undefined,
      update: (cache, { data }) => {
        if (data?.createFileVersion) {
          updateCachedVersions<CreateFileVersionMutation>(
            cache,
            data.createFileVersion.children.items,
            parentId
          );
        }
      },
    });
  };

  const uploadProjectFiles = ({
    action,
    files,
    parentId,
  }: UploadFilesConsumerInput) =>
    uploadFiles({ action, files, handleUploadCompleted, parentId });

  return uploadProjectFiles;
};

export const useUploadBudgetFile = (): UploadFilesConsumerFunction => {
  const uploadFiles = useUploadFiles();

  const [uploadFile] = useUpdateProjectBudgetUniversalTemplateMutation();

  const handleUploadCompleted: HandleUploadCompletedFunction = async ({
    uploadId,
    name,
    parentId: id,
    action,
  }) => {
    await uploadFile({
      variables: {
        id,
        universalTemplateFile: { uploadId, name },
      },
      refetchQueries:
        action === 'file' ? [GQLOperations.Query.ProjectBudget] : undefined,
      update:
        action !== 'version'
          ? undefined
          : (cache, { data }) => {
              const template =
                data?.updateBudget.budget.universalTemplateFile.value;
              if (template) {
                updateCachedVersions(
                  cache,
                  template.children.items,
                  template.id
                );
              }
            },
    });
  };

  const uploadBudgetFile = ({
    action,
    files,
    parentId,
  }: UploadFilesConsumerInput) =>
    uploadFiles({ action, files, handleUploadCompleted, parentId });

  return uploadBudgetFile;
};
