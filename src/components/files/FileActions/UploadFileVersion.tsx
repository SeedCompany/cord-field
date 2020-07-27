import React, { FC } from 'react';
import { Except } from 'type-fest';
import { File, GQLOperations } from '../../../api';
import {
  UploadCallback,
  UploadFilesForm,
  UploadFilesFormProps,
} from '../../Upload';
import { useCreateFileVersionMutation } from './FileActions.generated';

export type UploadFileVersionProps = Except<
  UploadFilesFormProps,
  'onFinalizeUpload' | 'onSubmit' | 'title'
> & {
  file?: File;
};

export const UploadFileVersion: FC<UploadFileVersionProps> = (props) => {
  const { file, ...rest } = props;
  const id = file?.id ?? '';
  const fileName = file?.name ?? '';
  const [createFileVersion] = useCreateFileVersionMutation();

  const handleUploadCompleted: UploadCallback = async (uploadId, name) => {
    const input = {
      uploadId,
      name,
      parentId: id,
    };
    await createFileVersion({
      variables: { input },
      refetchQueries: [GQLOperations.Query.ProjectDirectory],
    });
  };

  return !id ? null : (
    <UploadFilesForm
      {...rest}
      onFinalizeUpload={handleUploadCompleted}
      multiple={false}
      title={fileName ? `Upload new version of "${fileName}"` : undefined}
    />
  );
};
