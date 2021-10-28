import { EngagementBreadcrumbFragment } from '../../../components/EngagementBreadcrumb/EngagementBreadcrumb.generated';

export const useLanguageEngagementName = (
  engagement?: EngagementBreadcrumbFragment
): string | null => {
  if (engagement?.__typename !== 'LanguageEngagement') {
    return null;
  }
  const language = engagement.language.value;
  const languageName = language?.name.value ?? language?.displayName.value;
  return languageName ?? null;
};
