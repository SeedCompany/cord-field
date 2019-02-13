import { buildEnum } from '@app/core/models/enum';
import { Organization } from '@app/core/models/organization';
import { Project } from '@app/core/models/project';
import { generateObjectId } from '@app/core/util';

export interface BudgetDetails {
  organization: Organization;
  fiscalYear: number;
  amount: number;
}

export class Budget {
  id: string;
  status: BudgetStatus;
  budgetDetails: BudgetDetails[];

  static fromJson(project: Project, json: any): Budget {
    const budget = new Budget();

    budget.id = json.id;
    budget.status = json.status;
    budget.budgetDetails = (json.budgetDetails || []).map((detail: any) => ({
      ...detail,
      organization: project.partnerships.find(p => p.id === detail.organizationId)!.organization,
    }));

    return budget;
  }

  static forSaveAPI = ({ budgetDetails, ...budget }: Budget) => ({
    budgetDetails: budgetDetails.map(({ organization, ...details }) => ({
      organizationId: organization.id,
      ...details,
    })),
    ...budget,
  });

  static create(): Budget {
    return Object.assign(new Budget(), {
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
