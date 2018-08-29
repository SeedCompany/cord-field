import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { TitleAware } from '@app/core/decorators';
import { Degree, Education, KnownLanguage, LanguageProficiency } from '@app/core/models/user';
import { generateObjectId, onlyValidValues, TypedFormControl } from '@app/core/util';
import { UserViewStateService } from '@app/people/user-view-state.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-person-edit-about',
  templateUrl: './person-edit-about.component.html',
  styleUrls: ['./person-edit-about.component.scss']
})
@TitleAware('Edit About')
export class PersonEditAboutComponent extends SubscriptionComponent implements OnInit {

  readonly LanguageProficiency = LanguageProficiency;
  readonly Degree = Degree;
  readonly skillsList = [
    'Audio to Audio Translation',
    'Guest Scholar (Exegetical, Linguistic, Bible)',
    'Linguistic Consultant',
    'Manager - Translation Consultant',
    'Story Checker',
    'Translation CIT',
    'Translation Consultant'
  ];

  form = this.formBuilder.group({
    bio: [''],
    education: this.formBuilder.array([]),
    skills: [[]],
    knownLanguages: this.formBuilder.array([])
  });

  addEducation: (education?: Education) => void;
  removeEducation: (index: number) => void;
  addKnownLanguage: (kl?: KnownLanguage) => void;
  removeKnownLanguage: (index: number) => void;

  constructor(private userViewState: UserViewStateService,
              private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    const createEduControl = (education?: Education) => {
      education = education || Education.create();

      return this.formBuilder.group({
        id: [education.id],
        degree: [education.degree, Validators.required],
        major: [education.major, [Validators.required, Validators.minLength(1)]],
        institution: [education.institution, [Validators.required, Validators.minLength(1)]]
      });
    };

    const edu = this.userViewState.createFormArray('education', createEduControl, this.unsubscribe);
    this.form.setControl('education', edu.control);
    this.addEducation = edu.add;
    this.removeEducation = edu.remove;

    const createKnownLanguageControl = (knownLanguage?: Partial<KnownLanguage>) => {
      knownLanguage = knownLanguage || {
        id: generateObjectId(),
        language: undefined,
        proficiency: undefined
      };

      return this.formBuilder.group({
        id: [knownLanguage.id],
        language: [knownLanguage.language, Validators.required],
        proficiency: [knownLanguage.proficiency, Validators.required]
      });
    };

    const kl = this.userViewState.createFormArray('knownLanguages', createKnownLanguageControl, this.unsubscribe);
    this.form.setControl('knownLanguages', kl.control);
    this.addKnownLanguage = kl.add;
    this.removeKnownLanguage = kl.remove;

    this.userViewState.user
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
        this.bio.reset(user.bio, {emitEvent: false});
        this.skills.reset(user.skills, {emitEvent: false});
      });

    this.form.valueChanges
      .pipe(
        takeUntil(this.unsubscribe),
        onlyValidValues(this.form)
      )
      .subscribe(({bio, skills}) => {
        this.userViewState.change({bio, skills});
      });
  }

  get bio(): TypedFormControl<string> {
    return this.form.get('bio') as TypedFormControl<string>;
  }

  get skills(): TypedFormControl<string[]> {
    return this.form.get('skills') as TypedFormControl<string[]>;
  }

  get education(): FormArray {
    return this.form.get('education') as FormArray;
  }

  get knownLanguages(): FormArray {
    return this.form.get('knownLanguages') as FormArray;
  }

  trackEducationControlBy(index: number, control: AbstractControl) {
    return control.get('id')!.value;
  }

  trackKnownLanguageControlBy(index: number, control: AbstractControl) {
    return control.get('id')!.value;
  }

  trackSkillBy(index: number, skill: string): string {
    return skill;
  }
}
