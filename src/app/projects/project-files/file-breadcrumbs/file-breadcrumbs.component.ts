import { Component, Input } from '@angular/core';
import { Directory, ParentRef } from '@app/core/models/file-node';

@Component({
  selector: 'app-file-breadcrumbs',
  templateUrl: './file-breadcrumbs.component.html',
  styleUrls: ['./file-breadcrumbs.component.scss'],
})
export class FileBreadcrumbsComponent {
  @Input() directory: Directory | null;

  trackParentRef(index: number, ref: ParentRef) {
    return ref.id;
  }
}
