import { useMutation } from '@apollo/client';
import { CalendarDate } from '../../../util';
import { useUploadFiles } from '../../files/hooks';
import { UpdatePeriodicReportDocument } from './UpdatePeriodicReport.generated';

export const useUpdatePeriodicReport = () => {
  const uploadFiles = useUploadFiles();
  const [uploadFile] = useMutation(UpdatePeriodicReportDocument);

  return async (id: string, files?: File[], receivedDate?: CalendarDate) => {
    const updateReport = async (uploadId?: string, name?: string) => {
      await uploadFile({
        variables: {
          input: {
            id,
            ...(uploadId ? { reportFile: { uploadId, name } } : {}),
            receivedDate,
          },
        },
      });
    };
    if (id) {
      if (files) {
        uploadFiles({
          files,
          handleUploadCompleted: async ({ uploadId, name }) => {
            await updateReport(uploadId, name);
          },
          parentId: id,
        });
      } else {
        await updateReport();
      }
    }
  };
};
