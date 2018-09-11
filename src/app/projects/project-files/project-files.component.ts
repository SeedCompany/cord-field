import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleAware } from '@app/core/decorators';
import { FileList, FileNode, FileNodeType } from '@app/core/models/file-node';

import { ProjectFilesService } from '@app/core/services/project-files.service';
import { combineLatest } from 'rxjs';
import { startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ProjectTabComponent } from '../abstract-project-tab';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-files',
  templateUrl: './project-files.component.html',
  styleUrls: ['./project-files.component.scss']
})
@TitleAware('Files')
export class ProjectFilesComponent extends ProjectTabComponent implements AfterViewInit {

  readonly displayedColumns = ['name', 'createdAt', 'owner', 'type', 'size'];
  readonly pageSizeOptions = [10, 25, 50];
  readonly FileNodeType = FileNodeType;

  totalCount = 0;
  fileSource = new MatTableDataSource<FileNode>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private activatedRoute: ActivatedRoute,
              private fileService: ProjectFilesService,
              projectViewState: ProjectViewStateService,
              private router: Router) {
    super(projectViewState);
  }

  ngAfterViewInit(): void {

    this.projectViewState.project
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        combineLatest(
          this.sort.sortChange
            .pipe(
              tap(() => this.paginator.pageIndex = 0),
              startWith({ active: 'createdAt', direction: 'desc' } as Sort)
            ),
          this.paginator.page
            .pipe(startWith({ pageIndex: 0, pageSize: 10, length: 0 } as PageEvent)),
          this.activatedRoute.queryParams
        )
          .pipe(switchMap(([sort, page, params]) => {
            return this.fileService.getFiles(
              this.project.id,
              params.parentId,
              sort.active as keyof FileNode,
              sort.direction,
              page.pageIndex * page.pageSize,
              page.pageSize
            );

          }))
          .subscribe((data: FileList) => {
            this.fileSource.data = data.files;
            this.totalCount = data.total;
          });
      });
  }

  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    if (bytes === 0) {
      return `${bytes} ${sizes[0]}`;
    }
    const sizeIndex = Number(Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${Math.round(bytes / Math.pow(1024, sizeIndex))} ${sizes[sizeIndex]}`;
  }

  async validateNavigation(file: FileNode): Promise<void> {
    if (file.type === FileNodeType.Directory) {
      await this.router.navigate([`/projects/${this.project.id}/files`], {
        queryParams: { parentId: file.id }
      });
    }
  }
}
