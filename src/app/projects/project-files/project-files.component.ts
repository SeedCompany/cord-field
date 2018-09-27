import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleAware } from '@app/core/decorators';
import { Directory, FileKeys, FileNode, FileNodeType } from '@app/core/models/file-node';
import { ProjectFilesService } from '@app/core/services/project-files.service';
import { filterRequired } from '@app/core/util';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-files',
  templateUrl: './project-files.component.html',
  styleUrls: ['./project-files.component.scss']
})
@TitleAware('Files')
export class ProjectFilesComponent extends SubscriptionComponent implements AfterViewInit {

  readonly displayedColumns: FileKeys[] = ['name', 'createdAt', 'owner', 'type', 'size'];
  readonly pageSizeOptions = [10, 25, 50];
  readonly FileNodeType = FileNodeType;

  directory$ = new BehaviorSubject<Directory | null>(null);
  dataSource = new MatTableDataSource<FileNode>();
  totalCount = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private activatedRoute: ActivatedRoute,
              private fileService: ProjectFilesService,
              private projectViewState: ProjectViewStateService,
              private router: Router) {
    super();
  }

  get directory(): Observable<Directory> {
    return this.directory$
      .pipe(
        takeUntil(this.unsubscribe),
        filterRequired()
      );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    combineLatest(
      this.activatedRoute.queryParams,
      this.projectViewState.project
        .pipe(
          filter(project => Boolean(project.id))
        )
    )
      .pipe(
        takeUntil(this.unsubscribe),
        switchMap(([params, project]) =>
          this.fileService.getDirectory(project.id, params.parent))
      )
      .subscribe(this.directory$);

    this.directory.subscribe(directory => {
      this.dataSource.data = directory.children;
      this.totalCount = directory.children.length;
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

  onNodeClick(node: FileNode): void {
    if (node.isFile()) {
      return;
    }
    this.router.navigate(['.'], {
      queryParams: { parent: node.id },
      relativeTo: this.activatedRoute
    });
  }
}
