import { Component } from '@angular/core';
import { TitleAware } from '../decorators';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
})
@TitleAware('Not Found')
export class NotFoundPageComponent {
}
