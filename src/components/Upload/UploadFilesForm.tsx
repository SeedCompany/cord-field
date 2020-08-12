import React from 'react';
import { Except } from 'type-fest';
import { DialogForm, DialogFormProps } from '../Dialog/DialogForm';
import { DropzoneField, SubmitError } from '../form';
import { UploadCallback, useUpload } from '../Upload';

export type UploadFilesFormProps = DialogFormProps<{ files: File[] }> & {
  onFinalizeUpload: UploadCallback;
  multiple?: boolean;
};

export const UploadFilesForm = (
  props: Except<UploadFilesFormProps, 'onSubmit'>
) => {
  const { onFinalizeUpload, multiple = true } = props;
  const { addFilesToUploadQueue } = useUpload();

  const onSubmit: UploadFilesFormProps['onSubmit'] = ({ files }) => {
    const fileInputs = files.map((file) => ({
      file,
      fileName: file.name,
      callback: onFinalizeUpload,
    }));
    addFilesToUploadQueue(fileInputs);
  };

  return (
    <DialogForm
      DialogProps={{
        fullWidth: true,
        maxWidth: 'xs',
      }}
      title="Upload Files"
      {...props}
      onSubmit={onSubmit}
    >
      <SubmitError />
      <DropzoneField multiple={multiple} name="files" />
    </DialogForm>
  );
};
