import React from 'react';
import { Except } from 'type-fest';
import { GQLOperations } from '../../../api';
import { useCreateFileVersionMutation } from '../../../components/files/FileActions';
import {
  UploadCallback,
  UploadFilesForm,
  UploadFilesFormProps,
} from '../../../components/Upload';
import { useProjectCurrentDirectory } from './useProjectCurrentDirectory';

export type UploadProjectFilesProps = Except<
  UploadFilesFormProps,
  'onFinalizeUpload' | 'onSubmit' | 'title'
>;

export const UploadProjectFiles = (props: UploadProjectFilesProps) => {
  const [createFileVersion] = useCreateFileVersionMutation();
  const { directoryId } = useProjectCurrentDirectory();

  const handleUploadCompleted: UploadCallback = async (uploadId, name) => {
    const input = {
      uploadId,
      name,
      parentId: directoryId,
    };
    await createFileVersion({
      variables: { input },
      refetchQueries: [GQLOperations.Query.ProjectDirectory],
    });
  };

  return (
    <UploadFilesForm {...props} onFinalizeUpload={handleUploadCompleted} />
  );
};
