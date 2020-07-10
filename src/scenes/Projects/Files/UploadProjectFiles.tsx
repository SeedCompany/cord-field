import React from 'react';
import { Except } from 'type-fest';
import { GQLOperations } from '../../../api';
import {
  UploadCallback,
  UploadFilesForm,
  UploadFilesFormProps,
} from '../../../components/Upload';
import { useCreateProjectFileVersionMutation } from './CreateProjectFile.generated';
import { useProjectCurrentDirectory } from './useProjectCurrentDirectory';

export type UploadProjectFilesProps = Except<
  UploadFilesFormProps,
  'callback' | 'onSubmit' | 'title'
>;

export const UploadProjectFiles = (props: UploadProjectFilesProps) => {
  const [createFileVersion] = useCreateProjectFileVersionMutation();
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

  return <UploadFilesForm {...props} callback={handleUploadCompleted} />;
};
