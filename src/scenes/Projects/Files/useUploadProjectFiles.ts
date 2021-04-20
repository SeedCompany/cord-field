import { useMutation } from '@apollo/client';
import { GQLOperations } from '../../../api';
import { CreateFileVersionDocument } from '../../../components/files/FileActions';
import {
  HandleUploadCompletedFunction,
  UploadFilesConsumerFunction,
  UploadFilesConsumerInput,
  useUploadFiles,
} from '../../../components/files/hooks';
import { updateCachedVersions } from '../../../components/files/updateCachedVersions';
import { UpdateProjectBudgetUniversalTemplateDocument } from '../Budget/ProjectBudget.generated';
import { ProjectDirectoryContentsFragmentDoc } from './ProjectFiles.generated';

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
      update: (cache, { data }) => {
        console.log(input, action, cache, data);
        if (!data?.createFileVersion) {
          return;
        }
        if (action === 'version') {
          updateCachedVersions(
            cache,
            data.createFileVersion.children.items,
            parentId
          );
          return;
        }
        const id = `Directory:${parentId}`;
        const cachedDir = cache.readFragment({
          id,
          fragment: ProjectDirectoryContentsFragmentDoc,
          fragmentName: 'ProjectDirectoryContents',
        });
        if (!cachedDir) {
          return;
        }
        const newFile = data.createFileVersion;
        const currentItems = cachedDir.children.items;
        const updatedData = {
          ...cachedDir,
          children: {
            ...cachedDir.children,
            items: currentItems.concat(newFile),
            total: currentItems.length + 1,
          },
        };
        cache.writeFragment({
          id,
          fragment: ProjectDirectoryContentsFragmentDoc,
          fragmentName: 'ProjectDirectoryContents',
          data: updatedData,
        });
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
