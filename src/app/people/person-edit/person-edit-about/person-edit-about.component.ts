import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { TitleAware } from '../../../core/decorators';
import { Language } from '../../../core/models/language';
import { Degree, Education, KnownLanguage, LanguageProficiency, UserProfile } from '../../../core/models/user';
import { UserViewStateService } from '../../user-view-state.service';
import { AbstractPersonComponent } from '../abstract-person.component';

@Component({
  selector: 'app-person-edit-about',
  templateUrl: './person-edit-about.component.html',
  styleUrls: ['./person-edit-about.component.scss']
})
@TitleAware('Edit About')

export class PersonEditAboutComponent extends AbstractPersonComponent implements OnInit {

  language: FormArray = this.formBuilder.array([]);
  education: FormArray = this.formBuilder.array([]);

  user: UserProfile;

  form = this.formBuilder.group({
    bio: [''],
    education: this.education,
    skills: [''],
    knownLanguages: this.language
  });

  customSkills: string[] = [];
  skillsList = [
    'Translation Expert',
    'Skills Number One',
    'Numchuku Skills',
    'Computer Hacking',
    'Bow Hunting',
    'Fossball',
    'Powerpoint',
    'Great Skills'
  ];

  readonly LanguageProficiency = LanguageProficiency;
  readonly Degree = Degree;

  constructor(userViewState: UserViewStateService, private formBuilder: FormBuilder) {
    super(userViewState);
    this.userViewState.user.subscribe((data) => {
      this.user = data;
    });
  }

  ngOnInit() {
    this.bio.setValue(this.user.bio);
    this.user.education.map((edu) => this.onCreateDegree(edu));
    this.skills.setValue(this.user.skills);
    this.user.customSkills.map((skill) => this.customSkills.push(skill));
    for (let index = 0; index < this.user.knownLanguages.length; index++) {
      this.onCreateLanguage(this.user.knownLanguages[index], index);
    }
    this.form.valueChanges.subscribe(changes => {
      this.userViewState.change(changes);
    });
  }
  get bio(): AbstractControl {
    return this.form.get('bio')!;
  }

  get skills(): AbstractControl {
    return this.form.get('skills')!;
  }

  get knownLanguages(): AbstractControl {
    return this.form.get('knownLanguages')!;
  }

  getLanguages(index: number): AbstractControl {
    return this.language.at(index).get('language')!;
  }

  onLanguageSelected(index: number, language: Language): void {
    this.getLanguages(index).setValue([...this.getLanguages(index).value, language]);
  }

  onLanguageRemoved(index: number, language: Language): void {
    this.getLanguages(index).setValue((this.getLanguages(index).value as Language[]).filter(lang => lang.id !== language.id));
  }

  onCreateDegree(degree: Education): void {
    if (!degree) {
      degree = Education.fromJson({} as Education);
    }
    this.education = this.form.get('education') as FormArray;
    this.education.push(this.addDegree(degree));
  }

  onRemoveDegree(index: number): void {
    this.education.removeAt(index);
  }

  addDegree(education: Education): FormGroup {
    return this.formBuilder.group({
      degree: [education.degree],
      major: [education.major],
      institution: [education.institution]
    });
  }

  onCreateLanguage(knownLanguage: KnownLanguage, index?: number): void {
    if (!knownLanguage) {
      knownLanguage = KnownLanguage.fromJson({} as KnownLanguage);
    }
    this.language = this.form.get('knownLanguages') as FormArray;
    this.language.push(this.addLanguage(knownLanguage));
    if (index) {
      this.onLanguageSelected(index, knownLanguage.language);
    }
  }

  addLanguage(language: KnownLanguage): FormGroup {
    return this.formBuilder.group({
      language: [[]],
      proficiency: [language.proficiency]
    });
  }

  onRemoveLanguage(index: number): void {
    this.language.removeAt(index);
  }


  trackByValue(index: number, value: any) {
    return value;
  }


  addCustomSkill(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();

    if ((value || '')) {
      this.customSkills.push(value);
    }

    if (input) {
      input.value = '';
    }
  }

  removeCustomSkill(skill: any): void {
    const index = this.customSkills.indexOf(skill);
    if (index >= 0) {
      this.customSkills.splice(index, 1);
    }
  }
}
