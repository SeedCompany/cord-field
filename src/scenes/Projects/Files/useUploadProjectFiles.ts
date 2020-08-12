import { useCallback } from 'react';
import { GQLOperations } from '../../../api';
import { useCreateFileVersionMutation } from '../../../components/files/FileActions';
import { UploadCallback, useUpload } from '../../../components/Upload';

export const useHandleUploadCompleted = (parentId: string): UploadCallback => {
  const [createFileVersion] = useCreateFileVersionMutation();

  const handleUploadCompleted: UploadCallback = useCallback(
    async (uploadId, name) => {
      const input = {
        uploadId,
        name,
        parentId,
      };
      await createFileVersion({
        variables: { input },
        refetchQueries: [GQLOperations.Query.ProjectDirectory],
      });
    },
    [parentId, createFileVersion]
  );
  return handleUploadCompleted;
};

export const useUploadProjectFiles = (
  parentId: string
): ((files: File[]) => void) => {
  const { addFilesToUploadQueue } = useUpload();

  const handleUploadCompleted = useHandleUploadCompleted(parentId);

  const handleFilesDrop = useCallback(
    (files: File[]) => {
      const fileInputs = files.map((file) => ({
        file,
        fileName: file.name,
        callback: handleUploadCompleted,
      }));
      addFilesToUploadQueue(fileInputs);
    },
    [addFilesToUploadQueue, handleUploadCompleted]
  );

  return handleFilesDrop;
};
