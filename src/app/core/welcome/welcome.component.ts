import {
  Component,
  OnInit
} from '@angular/core';
import { AuthenticationStorageService } from '../services/authentication-storage.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(private authStore: AuthenticationStorageService) {

  }

  ngOnInit() {
  }
}
