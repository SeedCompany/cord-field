import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ProjectRole } from '../../../core/models/project-role';
import { UserProfile } from '../../../core/models/user';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-person-profile',
  templateUrl: './person-profile.component.html',
  styleUrls: ['./person-profile.component.scss']
})
export class PersonProfileComponent implements OnInit, OnDestroy {
  readonly ProjectRole = ProjectRole;
  imgSrc = 'https://d30y9cdsu7xlg0.cloudfront.net/png/630729-200.png';
  id: string;
  idSub: Subscription = Subscription.EMPTY;
  user: UserProfile;

  constructor(private route: ActivatedRoute,
              private userService: UserService) {
  }

  async ngOnInit() {
    this.idSub = this.route.params.subscribe(params => {
      this.id = params.id;
      this.getUserProfile(this.id);
    });
  }

  ngOnDestroy() {
    this.idSub.unsubscribe();
  }

  async getUserProfile(id: string) {
    this.user = await this.userService.getUserProfile(id);
  }
}
