import { GQLOperations } from '../../../api';
import { useCreateFileVersionMutation } from '../../../components/files/FileActions';
import { UploadCallback, useUpload } from '../../../components/Upload';

interface UploadProjectFilesInput {
  files: File[];
  parentId: string;
  action?: Parameters<UploadCallback>[2];
}

interface HandleUploadCompletedInput
  extends Omit<UploadProjectFilesInput, 'files'> {
  uploadId: string;
  name: string;
}

type UploadProjectFilesFunction = (input: UploadProjectFilesInput) => void;

type HandleUploadCompletedFunction = (
  input: HandleUploadCompletedInput
) => Promise<void>;

export const useHandleUploadCompleted = (): HandleUploadCompletedFunction => {
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

export const useUploadProjectFiles = (): UploadProjectFilesFunction => {
  const { addFilesToUploadQueue } = useUpload();

  const handleUploadCompleted = useHandleUploadCompleted();

  const handleFilesDrop: UploadProjectFilesFunction = ({
    files,
    parentId,
    action,
  }) => {
    const fileInputs = files.map((file) => ({
      file,
      fileName: file.name,
      callback: (
        uploadId: Parameters<UploadCallback>[0],
        name: Parameters<UploadCallback>[1]
      ) => handleUploadCompleted({ uploadId, name, parentId, action }),
    }));
    addFilesToUploadQueue(fileInputs);
  };

  return handleFilesDrop;
};
