import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit, OnDestroy {
  idSub: Subscription = Subscription.EMPTY;

  constructor(private route: ActivatedRoute,
              private userService: UserService) {
  }

  async ngOnInit() {
    this.idSub = this.route.params.subscribe(params => {
      this.userService.getUserProfile(params.id);
    });
  }

  ngOnDestroy() {
    this.idSub.unsubscribe();
  }

}
