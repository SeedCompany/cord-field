import { GQLOperations } from '../../../api';
import { useCreateFileVersionMutation } from '../../../components/files/FileActions';
import { UploadCallback, useUpload } from '../../../components/Upload';

export const useHandleUploadCompleted = (parentId: string): UploadCallback => {
  const [createFileVersion] = useCreateFileVersionMutation();

  const handleUploadCompleted: UploadCallback = async (
    uploadId,
    name,
    action
  ) => {
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

export const useUploadProjectFiles = (
  parentId: string,
  action?: Parameters<UploadCallback>[2]
): ((files: File[]) => void) => {
  const { addFilesToUploadQueue } = useUpload();

  const handleUploadCompleted = useHandleUploadCompleted(parentId);

  const handleFilesDrop = (files: File[]) => {
    const fileInputs = files.map((file) => ({
      file,
      fileName: file.name,
      callback: (
        uploadId: Parameters<UploadCallback>[0],
        name: Parameters<UploadCallback>[1]
      ) => handleUploadCompleted(uploadId, name, action),
    }));
    addFilesToUploadQueue(fileInputs);
  };

  return handleFilesDrop;
};
