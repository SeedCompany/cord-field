import { GQLOperations } from '../../../api';
import { useCreateFileVersionMutation } from '../../../components/files/FileActions';
import { HandleUploadCompletedFunction } from '../../../components/files/hooks';

export const useHandleProjectFilesUploadCompleted = (): HandleUploadCompletedFunction => {
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
  return handleUploadCompleted;
};
