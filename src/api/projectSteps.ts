import { ProjectStatus, ProjectStep } from './schema.generated';

export const projectStepToStatusMap: Record<ProjectStatus, ProjectStep[]> = {
  InDevelopment: [
    'EarlyConversations',
    'PrepForConsultantEndorsement',
    'PrepForFinancialEndorsement',
    'FinalizingProposal',
    'PrepForGrowthPlanEndorsement',
    'PendingGrowthPlanEndorsement',
  ],
  Pending: [
    'PendingConceptApproval',
    'PendingConsultantEndorsement',
    'PendingFinancialEndorsement',
    'PendingAreaDirectorApproval',
    'PendingRegionalDirectorApproval',
    'PendingFinanceConfirmation',
    'OnHoldFinanceConfirmation',
  ],
  Active: ['Active'],
  Stopped: ['Suspended', 'Rejected', 'Terminated'],
  Finished: ['DidNotDevelop', 'Completed'],
};
