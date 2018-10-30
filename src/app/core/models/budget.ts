import { generateObjectId } from '@app/core/util';

export interface ProjectBudgetDetails {
  organizationId: string;
  fiscalYear: number;
  amount: string;
}

export class ProjectBudget {
  id: string;
  status: string;
  details: ProjectBudgetDetails[];

  static fromJson(json: any): ProjectBudget {
    const budget = new ProjectBudget();

    budget.id = json.id;
    budget.status = json.status;
    budget.details = json.budgetDetails;

    return budget;
  }

  static create(): ProjectBudget {
    return Object.assign(new ProjectBudget(), {
      id: generateObjectId(),
      status: undefined,
      details: []
    });
  }
}
