import { useMutation } from '@apollo/client';
import { addItemToList } from '../../../api';
import { CreateFileVersionDocument } from '../../../components/files/FileActions';
import {
  HandleUploadCompletedFunction,
  UploadFilesConsumerFunction,
  UploadFilesConsumerInput,
  useUploadFiles,
} from '../../../components/files/hooks';

export const useUploadReportFiles = (): UploadFilesConsumerFunction => {
  const uploadFiles = useUploadFiles();
  const [createFileVersion] = useMutation(CreateFileVersionDocument);

  const handleUploadCompleted: HandleUploadCompletedFunction = async ({
    uploadId,
    name,
    parentId,
  }) => {
    const input = {
      uploadId,
      name,
      parentId,
    };
    await createFileVersion({
      variables: { input },
      update: addItemToList({
        listId: [{ __typename: 'Directory', id: parentId }, 'children'],
        outputToItem: (res) => res.createFileVersion,
      }),
    });
  };

  const uploadReportFiles = ({
    action,
    files,
    parentId,
  }: UploadFilesConsumerInput) =>
    uploadFiles({ action, files, handleUploadCompleted, parentId });

  return uploadReportFiles;
};
