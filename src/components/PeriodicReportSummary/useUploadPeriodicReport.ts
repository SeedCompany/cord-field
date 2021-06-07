import { useMutation } from '@apollo/client';
import {
  HandleUploadCompletedFunction,
  UploadFilesConsumerInput,
  useUploadFiles,
} from '../files/hooks';
import { UploadPeriodicReportDocument } from './PeriodicReport.generated';

export const useUploadPeriodicReport = () => {
  const uploadFiles = useUploadFiles();
  const [uploadFile] = useMutation(UploadPeriodicReportDocument);

  const handleUploadCompleted: HandleUploadCompletedFunction = async ({
    uploadId,
    name,
    parentId: reportId,
  }) => {
    await uploadFile({
      variables: {
        reportId: reportId,
        file: { uploadId, name },
      },
    });
  };

  const uploadPeriodicReportFile = ({
    files,
    parentId,
  }: UploadFilesConsumerInput) =>
    uploadFiles({ files, handleUploadCompleted, parentId });

  return uploadPeriodicReportFile;
};
