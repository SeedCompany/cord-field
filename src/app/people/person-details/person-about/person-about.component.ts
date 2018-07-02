import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ProjectRole } from '../../../core/models/project-role';
import { Degree, LanguageProficiency, UserProfile } from '../../../core/models/user';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-person-about',
  templateUrl: './person-about.component.html',
  styleUrls: ['./person-about.component.scss']
})
export class PersonAboutComponent implements OnInit, OnDestroy {

  readonly Degree = Degree;
  readonly LanguageProficiency = LanguageProficiency;
  readonly ProjectRole = ProjectRole;
  private userProfileSub: Subscription = Subscription.EMPTY;
  user: UserProfile;
  customSkills: string;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userProfileSub = this.userService.userProfile$.subscribe(user => this.user = user);
    this.customSkills = this.user.customSkills.length > 0 ? this.user.customSkills.join(',') : '';
    this.user.bio = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s ' +
      'standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a ' +
      'type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remainin' +
      'g essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsu' +
      'm passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';
  }

  ngOnDestroy() {
    this.userProfileSub.unsubscribe();
  }
}
