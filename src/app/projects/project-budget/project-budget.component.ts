import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TitleAware } from '@app/core/decorators';
import { ProjectBudget } from '@app/core/models/budget';
import { ProjectTabComponent } from '../abstract-project-tab';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-budget',
  templateUrl: './project-budget.component.html',
  styleUrls: ['./project-budget.component.scss']
})
@TitleAware('Budget')
export class ProjectBudgetComponent extends ProjectTabComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    projectViewState: ProjectViewStateService
  ) {
    super(projectViewState);

    this._initForm();
    this._initViewState();
  }

  get budgets(): FormArray {
    return this.form.get('budgets') as FormArray;
  }

  ngOnInit(): void {
    const createBudgetCtrl = (projectBudget?: ProjectBudget) => {
      const budget = projectBudget || ProjectBudget.create();

      return this.formBuilder.group({
        id: [budget.id],
        partnerName: [budget.partnerName],
        fiscalYear: [budget.fiscalYear],
        amount: [budget.amount]
      });
    };

    const budgetCtrl = this.projectViewState.createFormArray('team', createBudgetCtrl, this.unsubscribe);
    this.form.setControl('budgets', budgetCtrl.control);
  }

  private _initForm(): void {
    this.form = this.formBuilder.group({
      budgets: [[]]
    });
  }

  private _initViewState(): void {


  }
}
