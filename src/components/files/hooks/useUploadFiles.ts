import { UploadCallback, useUpload } from '../../../components/Upload';

export interface UploadFilesInput {
  action?: Parameters<UploadCallback>[2];
  files: File[];
  handleUploadCompleted: HandleUploadCompletedFunction;
  parentId: string;
}

export type UploadFilesConsumerInput = Omit<
  UploadFilesInput,
  'handleUploadCompleted'
>;

export interface HandleUploadCompletedInput
  extends Omit<UploadFilesInput, 'files' | 'handleUploadCompleted'> {
  name: string;
  uploadId: string;
}

type UploadFilesFunction = (input: UploadFilesInput) => void;
export type UploadFilesConsumerFunction = (
  input: UploadFilesConsumerInput
) => void;

export type HandleUploadCompletedFunction = (
  input: HandleUploadCompletedInput
) => Promise<void>;

export const useUploadFiles = (): UploadFilesFunction => {
  const { addFilesToUploadQueue } = useUpload();

  const handleFilesDrop: UploadFilesFunction = ({
    files,
    parentId,
    action,
    handleUploadCompleted,
  }) => {
    const fileInputs = files.map((file) => ({
      file,
      fileName: file.name,
      callback: (
        uploadId: Parameters<UploadCallback>[0],
        name: Parameters<UploadCallback>[1]
      ) => handleUploadCompleted({ uploadId, name, parentId, action }),
    }));
    addFilesToUploadQueue(fileInputs);
  };

  return handleFilesDrop;
};
