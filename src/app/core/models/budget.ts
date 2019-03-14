import { FieldConfig, returnId } from '@app/core/change-engine';
import { buildEnum } from '@app/core/models/enum';
import { Internship } from '@app/core/models/internship';
import { Organization } from '@app/core/models/organization';
import { Project } from '@app/core/models/project';
import { generateObjectId, Omit } from '@app/core/util';

export interface BudgetDetails {
  organization: Organization;
  fiscalYear: number;
  amount: number;
}

export type ModifiedBudgets = ServerBudget[];
type ServerBudget = Omit<Budget, 'budgetDetails'> & { budgetDetails: ServerBudgetDetails[] };
type ServerBudgetDetails = Omit<BudgetDetails, 'organization'> & { organizationId: string };

export class Budget {
  id: string;
  status: BudgetStatus;
  budgetDetails: BudgetDetails[];

  static fromJson(project: Project | Internship, json: any): Budget {
    const budget = new Budget();

    budget.id = json.id;
    budget.status = json.status;
    budget.budgetDetails = (json.budgetDetails || []).map((detail: any) => ({
      ...detail,
      organization: project.partnerships.find(p => p.id === detail.organizationId)!.organization,
    }));

    return budget;
  }

  static fieldConfigList = (): FieldConfig<Budget[], ModifiedBudgets> => ({
    accessor: returnId,
    toServer: (changes) => changes.update ? changes.update.map(Budget.forSaveAPI) : [],
  });

  static forSaveAPI = ({ budgetDetails, ...budget }: Budget): ServerBudget => ({
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
