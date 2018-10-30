import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TitleAware } from '@app/core/decorators';
import { ProjectBudget } from '@app/core/models/budget';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { takeUntil } from 'rxjs/operators';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-budget',
  templateUrl: './project-budget.component.html',
  styleUrls: ['./project-budget.component.scss']
})
@TitleAware('Budget')
export class ProjectBudgetComponent extends SubscriptionComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private viewStateService: ProjectViewStateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();

    this.viewStateService.project
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(project => {
        this.createBudgetForm(project.budgets);
      });
  }

  get budgets(): FormArray {
    return this.form.get('budgets') as FormArray;
  }

  trackBudgetById(index: number, control: AbstractControl) {
    return control.get('id')!.value;
  }

  private createBudgetForm(budgets: ProjectBudget[]) {
    if (budgets.length) {
      budgets[0].details.forEach((detail) => {
        this.budgets.push(this.formBuilder.group({
          id: detail.organizationId,
          fiscalYear: detail.fiscalYear,
          amount: detail.amount
        }));
      });
    }
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      budgets: this.formBuilder.array([])
    });
  }
}
