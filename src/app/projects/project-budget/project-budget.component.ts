import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TitleAware } from '@app/core/decorators';
import { BudgetStatus, ProjectBudget, ProjectBudgetDetails } from '@app/core/models/budget';
import { filterRequired } from '@app/core/util';
import { ProjectTabComponent } from '@app/projects/abstract-project-tab';
import { Observable } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { ProjectViewStateService } from '../project-view-state.service';

/* tslint:disable:trackBy-function */
@Component({
  selector: 'app-project-budget',
  templateUrl: './project-budget.component.html',
  styleUrls: ['./project-budget.component.scss'],
})
@TitleAware('Budget')
export class ProjectBudgetComponent extends ProjectTabComponent implements OnInit {
  form: FormGroup;
  total: Observable<number>;

  constructor(
    private formBuilder: FormBuilder,
    private viewStateService: ProjectViewStateService,
  ) {
    super(viewStateService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initForm();

    this.project$
      .pipe(
        map(project => project.budgets.find(budget => budget.status === BudgetStatus.Current)),
        filterRequired(),
      )
      .subscribe(budget => this.createBudgetForm(budget));

    this.form.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(val => {
        this.viewStateService.change({
          budgets: [val],
        });
      });

    this.total = (this.budgets.valueChanges as Observable<ProjectBudgetDetails[]>)
      .pipe(
        startWith(this.budgets.value as ProjectBudgetDetails[]),
        map(val => val.reduce((total, item) => total + Number(item.amount || 0), 0)),
      );
  }

  get budgets(): FormArray {
    return this.form.get('budgetDetails') as FormArray;
  }

  trackBudgetById(index: number, control: AbstractControl) {
    return control.get('organization')!.value.id;
  }

  private createBudgetForm(budget: ProjectBudget) {
    this.form.reset({
      id: budget.id,
      status: budget.status,
    }, {
      emitEvent: false,
    });

    const budgets = this.budgets;
    while (budgets.length !== 0) {
      budgets.removeAt(0);
    }
    for (const detail of budget.budgetDetails) {
      budgets.push(this.formBuilder.group({
        organization: detail.organization,
        fiscalYear: detail.fiscalYear,
        amount: [detail.amount, [Validators.required, Validators.min(0)]],
      }));
    }
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      id: [''],
      status: [''],
      budgetDetails: this.formBuilder.array([]),
    });
  }
}
