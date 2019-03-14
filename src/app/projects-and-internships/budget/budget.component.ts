import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractViewState } from '@app/core/abstract-view-state';
import { TitleAware } from '@app/core/decorators';
import { Budget, BudgetDetails, BudgetStatus } from '@app/core/models/budget';
import { Internship } from '@app/core/models/internship';
import { Project } from '@app/core/models/project';
import { IsDirty } from '@app/core/route-guards/dirty.guard';
import { filterRequired } from '@app/core/util';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { Observable } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

/* tslint:disable:trackBy-function */
@Component({
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
})
@TitleAware('Budget')
export class BudgetComponent extends SubscriptionComponent implements OnInit, IsDirty {
  form: FormGroup;
  total: Observable<number>;

  constructor(
    private formBuilder: FormBuilder,
    private viewState: AbstractViewState<Project | Internship, unknown>,
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      status: [''],
      budgetDetails: this.formBuilder.array([]),
    });

    this.viewState.subjectWithPreExistingChanges
      .pipe(
        map(project => project.budgets.find(budget => budget.status === BudgetStatus.Current)),
        filterRequired(),
        takeUntil(this.unsubscribe),
      )
      .subscribe(budget => this.createBudgetForm(budget));

    this.form.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(val => {
        this.viewState.change({
          budgets: { update: val },
        });
      });

    this.total = (this.budgets.valueChanges as Observable<BudgetDetails[]>)
      .pipe(
        startWith(this.budgets.value as BudgetDetails[]),
        map(val => val.reduce((total, item) => total + Number(item.amount || 0), 0)),
      );
  }

  get budgets(): FormArray {
    return this.form.get('budgetDetails') as FormArray;
  }

  trackBudgetById(index: number, control: AbstractControl) {
    return control.get('organization')!.value.id;
  }

  get isDirty() {
    return this.viewState.isDirty;
  }

  onSave() {
    return this.viewState.save();
  }

  onDiscard() {
    return this.viewState.discard();
  }

  private createBudgetForm(budget: Budget) {
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
}
