import { entries, mapFromList } from '../util';
import { ProjectStatus, ProjectStep } from './schema.generated';

export const projectStatusToStepsMap: Record<ProjectStatus, ProjectStep[]> = {
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

export const projectSteps = Object.values(projectStatusToStepsMap).flat();

export const projectStatusFromStep = entries(projectStatusToStepsMap).reduce(
  (map, [status, steps]) => ({
    ...map,
    ...mapFromList(steps, (step) => [step, status]),
  }),
  {}
) as Record<ProjectStep, ProjectStatus>;
