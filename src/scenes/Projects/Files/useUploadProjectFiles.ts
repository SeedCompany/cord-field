import { GQLOperations } from '../../../api';
import { useCreateFileVersionMutation } from '../../../components/files/FileActions';
import {
  HandleUploadCompletedFunction,
  UploadFilesConsumerFunction,
  UploadFilesConsumerInput,
  useUploadFiles,
} from '../../../components/files/hooks';

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
