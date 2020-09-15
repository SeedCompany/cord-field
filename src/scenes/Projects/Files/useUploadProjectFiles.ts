import { GQLOperations } from '../../../api';
import {
  FileVersionsDocument,
  FileVersionsQuery,
  useCreateFileVersionMutation,
} from '../../../components/files/FileActions';
import {
  HandleUploadCompletedFunction,
  UploadFilesConsumerFunction,
  UploadFilesConsumerInput,
  useUploadFiles,
} from '../../../components/files/hooks';
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
      refetchQueries: [
        action === 'version'
          ? GQLOperations.Query.FileVersions
          : GQLOperations.Query.ProjectDirectory,
      ],
      update: (cache, { data }) => {
        const response = cache.readQuery<FileVersionsQuery>({
          query: FileVersionsDocument,
          variables: { id: parentId },
        });
        if (data?.createFileVersion && response) {
          const updatedVersions = data.createFileVersion.children.items;
          const updatedData = {
            ...response,
            file: {
              ...response.file,
              children: {
                ...response.file.children,
                items: updatedVersions,
              },
            },
          };
          console.log('updatedData', updatedData);
          cache.writeQuery<FileVersionsQuery>({
            query: FileVersionsDocument,
            variables: { id: parentId },
            data: updatedData,
          });
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
      refetchQueries: [
        action === 'version'
          ? GQLOperations.Query.FileVersions
          : GQLOperations.Query.ProjectBudget,
      ],
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
