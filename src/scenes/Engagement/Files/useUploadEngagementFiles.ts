import { GQLOperations } from '../../../api';
import {
  HandleUploadCompletedFunction,
  UploadFilesConsumerFunction,
  UploadFilesConsumerInput,
  useUploadFiles,
} from '../../../components/files/hooks';
import {
  useUploadInternshipEngagementGrowthPlanMutation,
  useUploadLanguageEngagementPnpMutation,
} from './UploadEngagementFiles.generated';

type EngagementType = 'language' | 'internship';

export const useUploadEngagementFile = (
  engagementType: EngagementType
): UploadFilesConsumerFunction => {
  const uploadFiles = useUploadFiles();

  const [uploadPnp] = useUploadLanguageEngagementPnpMutation();
  const [uploadGrowthPlan] = useUploadInternshipEngagementGrowthPlanMutation();

  const uploadFile =
    engagementType === 'language' ? uploadPnp : uploadGrowthPlan;

  const handleUploadCompleted: HandleUploadCompletedFunction = async ({
    uploadId,
    name,
    parentId: id,
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

  const uploadEngagementFile = ({
    action,
    files,
    parentId,
  }: UploadFilesConsumerInput) =>
    uploadFiles({ action, files, handleUploadCompleted, parentId });

  return uploadEngagementFile;
};
