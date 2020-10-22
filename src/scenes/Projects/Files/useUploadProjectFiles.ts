import { useMutation } from '@apollo/client';
import { GQLOperations } from '../../../api';
import {
  CreateFileVersionDocument,
  CreateFileVersionMutation,
} from '../../../components/files/FileActions';
import {
  HandleUploadCompletedFunction,
  UploadFilesConsumerFunction,
  UploadFilesConsumerInput,
  useUploadFiles,
} from '../../../components/files/hooks';
import { updateCachedVersions } from '../../../components/files/updateCachedVersions';
import { UpdateProjectBudgetUniversalTemplateDocument } from '../Budget/ProjectBudget.generated';
import {
  ProjectDirectoryContentsFragment,
  ProjectDirectoryContentsFragmentDoc,
} from './ProjectFiles.generated';

export const useUploadProjectFiles = (): UploadFilesConsumerFunction => {
  const uploadFiles = useUploadFiles();
  const [createFileVersion] = useMutation(CreateFileVersionDocument);

  const handleUploadCompleted: HandleUploadCompletedFunction = async ({
    uploadId,
    name,
    parentId,
    action,
  }) => {
    const input = {
      uploadId,
      name,
      parentId,
    };
    await createFileVersion({
      variables: { input },
      refetchQueries:
        action === 'file' ? [GQLOperations.Query.ProjectDirectory] : undefined,
      update: (cache, { data }) => {
        if (data?.createFileVersion) {
          if (action === 'version') {
            updateCachedVersions<CreateFileVersionMutation>(
              cache,
              data.createFileVersion.children.items,
              parentId
            );
          } else {
            try {
              const id = `Directory:${parentId}`;
              const response = cache.readFragment<
                ProjectDirectoryContentsFragment
              >({
                id,
                fragment: ProjectDirectoryContentsFragmentDoc,
                fragmentName: 'ProjectDirectoryContents',
              });
              if (response) {
                const newFile = data.createFileVersion;
                const currentItems = response.children.items;
                const updatedData = {
                  ...response,
                  children: {
                    ...response.children,
                    items: currentItems.concat(newFile),
                    total: currentItems.length + 1,
                  },
                };
                cache.writeFragment<ProjectDirectoryContentsFragment>({
                  id,
                  fragment: ProjectDirectoryContentsFragmentDoc,
                  fragmentName: 'ProjectDirectoryContents',
                  data: updatedData,
                });
              }
            } catch {
              /**
               * We need this try/catch because if this data has never been fetched
               * before, `cache.readFragment` will throw an error instead of returning
               * anything, which is apparently a behavior the Apollo team finds
               * acceptable.
               */
              return;
            }
          }
        }
      },
    });
  };

  const uploadProjectFiles = ({
    action,
    files,
    parentId,
  }: UploadFilesConsumerInput) =>
    uploadFiles({ action, files, handleUploadCompleted, parentId });

  return uploadProjectFiles;
};

export const useUploadBudgetFile = (): UploadFilesConsumerFunction => {
  const uploadFiles = useUploadFiles();

  const [uploadFile] = useMutation(
    UpdateProjectBudgetUniversalTemplateDocument
  );

  const handleUploadCompleted: HandleUploadCompletedFunction = async ({
    uploadId,
    name,
    parentId: id,
    action,
  }) => {
    await uploadFile({
      variables: {
        id,
        universalTemplateFile: { uploadId, name },
      },
      refetchQueries:
        action === 'file' ? [GQLOperations.Query.ProjectBudget] : undefined,
      update:
        action !== 'version'
          ? undefined
          : (cache, { data }) => {
              const template =
                data?.updateBudget.budget.universalTemplateFile.value;
              if (template) {
                updateCachedVersions(
                  cache,
                  template.children.items,
                  template.id
                );
              }
            },
    });
  };

  const uploadBudgetFile = ({
    action,
    files,
    parentId,
  }: UploadFilesConsumerInput) =>
    uploadFiles({ action, files, handleUploadCompleted, parentId });

  return uploadBudgetFile;
};
