import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProjectRole } from '../../../core/models/project-role';
import { Degree, LanguageProficiency, UserProfile } from '../../../core/models/user';

@Component({
  selector: 'app-person-about',
  templateUrl: './person-about.component.html',
  styleUrls: ['./person-about.component.scss']
})
export class PersonAboutComponent implements OnChanges {

  readonly Degree = Degree;
  readonly LanguageProficiency = LanguageProficiency;
  readonly ProjectRole = ProjectRole;

  @Input() user: UserProfile;

  hasData: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    const user: UserProfile = changes.user.currentValue;

    this.hasData = user.bio.length > 0
      || user.education.length > 0
      || user.skills.length > 0
      || user.knownLanguages.length > 0
    ;
  }

  trackById(index: number, value: {id: string}): string {
    return value.id;
  }

  trackByValue(index: number, value: string): string {
    return value;
  }
}
