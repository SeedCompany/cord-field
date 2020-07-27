import React, { FC } from 'react';
import { Except } from 'type-fest';
import { File, GQLOperations } from '../../../api';
import {
  UploadCallback,
  UploadFilesForm,
  UploadFilesFormProps,
} from '../../../components/Upload';
import { useCreateProjectFileVersionMutation } from './CreateProjectFile.generated';

export type UploadProjectFileVersionProps = Except<
  UploadFilesFormProps,
  'onFinalizeUpload' | 'onSubmit' | 'title'
> & {
  file?: File;
};

export const UploadProjectFileVersion: FC<UploadProjectFileVersionProps> = (
  props
) => {
  const { file, ...rest } = props;
  const id = file?.id ?? '';
  const fileName = file?.name ?? '';
  const [createFileVersion] = useCreateProjectFileVersionMutation();

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
