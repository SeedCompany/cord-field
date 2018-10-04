import { generateObjectId } from '@app/core/util';

export class ProjectBudget {
  id: string;
  partnerName: string;
  fiscalYear: number;
  amount: number;

  static fromJson(json: any): ProjectBudget {
    const budget = new ProjectBudget();

    budget.id = json.partnerId;
    budget.partnerName = json.partnerName;
    budget.fiscalYear = json.fiscalYear;
    budget.amount = json.amount;

    return budget;
  }

  static create(): ProjectBudget {
    return Object.assign(new ProjectBudget(), {
      id: generateObjectId(),
      partnerName: 'Seed Company',
      fiscalYear: 2003,
      amount: 200000
    });
  }
}
