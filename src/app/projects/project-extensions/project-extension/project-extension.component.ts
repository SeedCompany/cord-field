import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Language } from '@app/core/models/language';
import { Project } from '@app/core/models/project';
import { ExtensionType, ProjectExtension } from '@app/core/models/project/extension';
import { ProjectService } from '@app/core/services/project.service';
import { filterRequired, TypedFormControl } from '@app/core/util';
import { ProjectViewStateService } from '@app/projects/project-view-state.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { DateTime } from 'luxon';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-project-extension',
  templateUrl: './project-extension.component.html',
  styleUrls: ['./project-extension.component.scss'],
})
export class ProjectExtensionComponent extends SubscriptionComponent implements OnInit {

  readonly ExtensionType = ExtensionType;

  project: Project | null;
  private readonly _extension = new BehaviorSubject<ProjectExtension | undefined>(undefined);
  readonly extension$: Observable<ProjectExtension> = this._extension.pipe(filterRequired());

  form = this.formBuilder.group({
    summary: ['', Validators.required],
    types: [[], Validators.required],
    additionalComment: [''],
    endDate: [null],
    languages: [[]],
  });

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private projectService: ProjectService,
              private projectViewState: ProjectViewStateService,
              private snackBar: MatSnackBar) {
    super();
  }

  get extension() {
    return this._extension.value;
  }

  get types(): TypedFormControl<ExtensionType[]> {
    return this.form.get('types') as TypedFormControl<ExtensionType[]>;
  }

  get endDate(): TypedFormControl<DateTime | null> {
    return this.form.get('endDate') as TypedFormControl<DateTime | null>;
  }

  get languages(): TypedFormControl<Language[]> {
    return this.form.get('languages') as TypedFormControl<Language[]>;
  }

  ngOnInit(): void {
    const project$ = this.projectViewState.project.pipe(takeUntil(this.unsubscribe));
    const id$ = this.route.params.pipe(map(({ id }) => id));
    combineLatest(project$, id$)
      .pipe(
        map(([project, id]) => id === 'new'
          ? ProjectExtension.create()
          : project.extensions.find(e => e.id === id)),
      )
      .subscribe(this._extension);
    project$.subscribe(p => this.project = p);

    this.extension$.subscribe(extension => {
      this.resetForm(extension);
    });

    this.types.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(types => {
        this.endDate.setValidators(types.includes(ExtensionType.Time) ? Validators.required : null);
        this.endDate.updateValueAndValidity();
        this.languages.setValidators(types.includes(ExtensionType.Language) ? Validators.required : null);
        this.languages.updateValueAndValidity();
      });
  }

  onRemoveLanguage(language: Language) {
    this.languages.setValue(this.languages.value.filter(l => l.id !== language.id));
  }

  async onSave(): Promise<void> {
    const extension = this.extension;
    if (!extension) {
      return;
    }

    const value = this.form.value;

    this.form.disable();
    try {
      await this.projectViewState.saveExtension({...value, id: extension.id});
    } catch (err) {
      this.snackBar.open('Failed to save extension', undefined, { duration: 3000 });
      return;
    } finally {
      this.form.enable();
    }
  }

  onReset() {
    const extension = this.extension;
    if (extension) {
      this.resetForm(extension);
    }
  }

  private resetForm(extension: ProjectExtension) {
    this.form.reset({
      summary: extension.summary,
      types: extension.types,
      additionalComment: extension.additionalComment,
      endDate: extension.endDate,
      languages: extension.languages,
    });
  }
}
