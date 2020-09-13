import { GQLOperations } from '../../../api';
import { HandleUploadCompletedFunction } from '../../../components/files/hooks';
import {
  useUploadInternshipEngagementGrowthPlanMutation,
  useUploadLanguageEngagementPnpMutation,
} from './UploadEngagementFiles.generated';

type EngagementType = 'language' | 'internship';

export const useHandleEngagementFileUploadCompleted = (
  engagementType: EngagementType
): HandleUploadCompletedFunction => {
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
  return handleUploadCompleted;
};
