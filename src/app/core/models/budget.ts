import { buildEnum } from '@app/core/models/enum';
import { Organization } from '@app/core/models/organization';
import { Project } from '@app/core/models/project';
import { generateObjectId } from '@app/core/util';

export interface ProjectBudgetDetails {
  organization: Organization;
  fiscalYear: number;
  amount: number;
}

export class ProjectBudget {
  id: string;
  status: BudgetStatus;
  budgetDetails: ProjectBudgetDetails[];

  static fromJson(project: Project, json: any): ProjectBudget {
    const budget = new ProjectBudget();

    budget.id = json.id;
    budget.status = json.status;
    budget.budgetDetails = (json.budgetDetails || []).map((detail: any) => ({
      ...detail,
      organization: project.partnerships.find(p => p.id === detail.organizationId)!.organization,
    }));

    return budget;
  }

  static forSaveAPI(budgets: ProjectBudget[]) {
    return budgets.map(({ budgetDetails, ...budget }) => ({
      budgetDetails: budgetDetails.map(({ organization, ...details }) => ({
        organizationId: organization.id,
        ...details,
      })),
      ...budget,
    }));
  }

  /** Identify project budget as a scalar value */
  static identify(budget: ProjectBudget): string {
    return [
      budget.id,
      budget.status,
      budget.budgetDetails.map(item => Number(item.amount || 0)).join(','),
    ].join(',');
  }

  static create(): ProjectBudget {
    return Object.assign(new ProjectBudget(), {
      id: generateObjectId(),
      status: BudgetStatus.Pending,
      budgetDetails: [],
    });
  }
}

export enum BudgetStatus {
  Pending = 'pending',
  Current = 'current',
  Superceded = 'superceded',
  Rejected = 'rejected',
}

export namespace BudgetStatus {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(BudgetStatus, {
    [BudgetStatus.Pending]: 'Pending',
    [BudgetStatus.Current]: 'Current',
    [BudgetStatus.Superceded]: 'Superceded',
    [BudgetStatus.Rejected]: 'Rejected',
  });
}
