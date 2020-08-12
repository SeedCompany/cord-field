import { useCallback } from 'react';
import { GQLOperations } from '../../../api';
import { UploadCallback, useUpload } from '../../../components/Upload';
import { useCreateProjectFileVersionMutation } from './CreateProjectFile.generated';

export const useHandleUploadCompleted = (parentId: string): UploadCallback => {
  const [createFileVersion] = useCreateProjectFileVersionMutation();

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
