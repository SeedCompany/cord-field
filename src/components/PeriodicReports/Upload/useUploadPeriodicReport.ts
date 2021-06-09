import { useMutation } from '@apollo/client';
import {
  HandleUploadCompletedFunction,
  useUploadFiles,
} from '../../files/hooks';
import { UploadPeriodicReportDocument } from './UploadPeriodicReport.generated';

export const useUploadPeriodicReport = (reportId?: string) => {
  const uploadFiles = useUploadFiles();
  const [uploadFile] = useMutation(UploadPeriodicReportDocument);

  const handleUploadCompleted: HandleUploadCompletedFunction = async ({
    uploadId,
    name,
    parentId: reportId,
  }) => {
    await uploadFile({
      variables: {
        input: {
          reportId,
          file: { uploadId, name },
        },
      },
    });
  };

  return (files: File[], reportIdOverride?: string) => {
    const id = reportIdOverride ?? reportId;
    if (id) {
      uploadFiles({ files, handleUploadCompleted, parentId: id });
    }
  };
};
