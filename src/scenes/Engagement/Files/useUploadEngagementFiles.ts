import { GQLOperations } from '../../../api';
import { UploadCallback, useUpload } from '../../../components/Upload';
import {
  useUploadInternshipEngagementGrowthPlanMutation,
  useUploadLanguageEngagementPnpMutation,
} from './UploadEngagementFiles.generated';

type EngagementType = 'language' | 'internship';

interface UploadProjectFilesInput {
  files: File[];
  engagementId: string;
  action?: Parameters<UploadCallback>[2];
}

interface HandleUploadCompletedInput
  extends Omit<UploadProjectFilesInput, 'files'> {
  uploadId: string;
  name: string;
}

type UploadProjectFilesFunction = (input: UploadProjectFilesInput) => void;

type HandleUploadCompletedFunction = (
  input: HandleUploadCompletedInput
) => Promise<void>;

export const useHandleUploadCompleted = (
  engagementType: EngagementType
): HandleUploadCompletedFunction => {
  const [uploadPnp] = useUploadLanguageEngagementPnpMutation();
  const [uploadGrowthPlan] = useUploadInternshipEngagementGrowthPlanMutation();
  const uploadFile =
    engagementType === 'language' ? uploadPnp : uploadGrowthPlan;

  const handleUploadCompleted: HandleUploadCompletedFunction = async ({
    uploadId,
    name,
    engagementId: id,
    action,
  }) => {
    await uploadFile({
      variables: {
        id,
        pnp: { uploadId, name },
        growthPlan: { uploadId, name },
      },
      refetchQueries: [
        action === 'version'
          ? GQLOperations.Query.FileVersions
          : GQLOperations.Query.Engagement,
      ],
    });
  };
  return handleUploadCompleted;
};

export const useUploadEngagementFiles = (
  engagementType: EngagementType
): UploadProjectFilesFunction => {
  const { addFilesToUploadQueue } = useUpload();

  const handleUploadCompleted = useHandleUploadCompleted(engagementType);

  const uploadProjectFiles: UploadProjectFilesFunction = ({
    files,
    engagementId,
    action,
  }) => {
    const fileInputs = files.map((file) => ({
      file,
      fileName: file.name,
      callback: (
        uploadId: Parameters<UploadCallback>[0],
        name: Parameters<UploadCallback>[1]
      ) => handleUploadCompleted({ uploadId, name, engagementId, action }),
    }));
    addFilesToUploadQueue(fileInputs);
  };

  return uploadProjectFiles;
};
