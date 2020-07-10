import React from 'react';
import { Except } from 'type-fest';
import { DialogForm, DialogFormProps } from '../Dialog/DialogForm';
import { DropzoneField, SubmitError } from '../form';
import { UploadCallback, useUpload } from '../Upload';

export type UploadFilesFormProps = DialogFormProps<{ files: File[] }> & {
  callback: UploadCallback;
  title?: string;
};

export const UploadFilesForm = (
  props: Except<UploadFilesFormProps, 'onSubmit'>
) => {
  const { callback, title = 'Upload Files' } = props;
  const { addFilesToUploadQueue } = useUpload();

  const onSubmit: UploadFilesFormProps['onSubmit'] = ({ files }) => {
    const fileInputs = files.map((file) => ({
      file,
      fileName: file.name,
      callback,
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
      title={title}
    >
      <SubmitError />
      <DropzoneField name="files" />
    </DialogForm>
  );
};
