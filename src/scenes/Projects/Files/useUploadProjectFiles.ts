import { useCallback } from 'react';
import { GQLOperations } from '../../../api';
import { UploadCallback, useUpload } from '../../../components/Upload';
import { useCreateProjectFileVersionMutation } from './CreateProjectFile.generated';
import { useProjectCurrentDirectory } from './useProjectCurrentDirectory';

export const useUploadProjectFiles = (): ((files: File[]) => void) => {
  const { addFilesToUploadQueue } = useUpload();
  const [createFileVersion] = useCreateProjectFileVersionMutation();

  const { directoryId } = useProjectCurrentDirectory();

  const handleUploadCompleted: UploadCallback = useCallback(
    async (uploadId, name) => {
      const input = {
        uploadId,
        name,
        parentId: directoryId,
      };
      await createFileVersion({
        variables: { input },
        refetchQueries: [GQLOperations.Query.ProjectDirectory],
      });
    },
    [directoryId, createFileVersion]
  );

  const handleFilesDrop = (files: File[]) => {
    const fileInputs = files.map((file) => ({
      file,
      fileName: file.name,
      callback: handleUploadCompleted,
    }));
    addFilesToUploadQueue(fileInputs);
  };

  return handleFilesDrop;
};
