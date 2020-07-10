import React from 'react';
import { Except } from 'type-fest';
import { GQLOperations } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { DropzoneField, SubmitError } from '../../../components/form';
import { UploadCallback, useUpload } from '../../../components/Upload';
import { useCreateProjectFileVersionMutation } from './CreateProjectFile.generated';
import { useProjectCurrentDirectory } from './useProjectCurrentDirectory';

export type UploadProjectFilesProps = DialogFormProps<{ files: File[] }>;

export const UploadProjectFiles = (
  props: Except<UploadProjectFilesProps, 'onSubmit'>
) => {
  const { addFilesToUploadQueue } = useUpload();
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

  const onSubmit: UploadProjectFilesProps['onSubmit'] = ({ files }) => {
    const fileInputs = files.map((file) => ({
      file,
      fileName: file.name,
      callback: handleUploadCompleted,
    }));
    addFilesToUploadQueue(fileInputs);
  };

  return (
    <DialogForm
      DialogProps={{
        fullWidth: true,
        maxWidth: 'xs',
      }}
      {...props}
      onSubmit={onSubmit}
      title="Upload Files"
    >
      <SubmitError />
      <DropzoneField name="files" />
    </DialogForm>
  );
};
