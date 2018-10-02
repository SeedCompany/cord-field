import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleAware } from '@app/core/decorators';
import { Directory, FileKeys, FileNode, FileNodeType } from '@app/core/models/file-node';
import { SUPPORTS_DOWNLOADS } from '@app/core/services/downloader.service';
import { ProjectFilesService } from '@app/core/services/project-files.service';
import { filterRequired } from '@app/core/util';
import { CreateDirectoryDialogComponent } from '@app/projects/project-files/create-directory-dialog/create-directory-dialog.component';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-files',
  templateUrl: './project-files.component.html',
  styleUrls: ['./project-files.component.scss']
})
@TitleAware()
export class ProjectFilesComponent extends SubscriptionComponent implements AfterViewInit {

  readonly displayedColumns: FileKeys[] = ['name', 'createdAt', 'owner', 'type', 'size'];
  readonly pageSizeOptions = [10, 25, 50];
  readonly FileNodeType = FileNodeType;
  readonly supportsDownloads = SUPPORTS_DOWNLOADS;

  directory$ = new BehaviorSubject<Directory | null>(null);
  dataSource = new MatTableDataSource<FileNode>();
  totalCount = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private activatedRoute: ActivatedRoute,
              private fileService: ProjectFilesService,
              private projectViewState: ProjectViewStateService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
    super();
  }

  get directory(): Observable<Directory> {
    return this.directory$
      .pipe(
        takeUntil(this.unsubscribe),
        filterRequired()
      );
  }

  get title() {
    return this.directory.pipe(
      startWith({ name: null }),
      map(dir => [dir.name, 'Files'])
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

  async onUpload(event: Event) {
    const directory = this.directory$.value;
    if (!directory) {
      return;
    }

    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const uploadFile = input.files[0];
    input.value = ''; // Clear input so it can be used again

    const ref = this.snackBar.open(`Uploading ${uploadFile.name}`);
    const notify = (message: string) => {
      ref.dismiss();
      this.snackBar.open(`${message} ${uploadFile.name}`, undefined, {duration: 3000});
    };

    try {
      const file = await this.fileService.upload(uploadFile, directory);
      this.directory$.next(directory.withChild(file));
      notify('Uploaded');
    } catch (e) {
      notify('Failed to upload');
    }
  }

  onCreateDir() {
    const directory = this.directory$.value;
    if (!directory) {
      return;
    }

    CreateDirectoryDialogComponent
      .open(this.dialog, directory)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(dir => {
        if (!dir) {
          return;
        }
        this.directory$.next(directory.withChild(dir));
      });
  }

  async onDownload(node: FileNode) {
    if (node.isDir()) {
      return;
    }
    const ref = this.snackBar.open(`Downloading ${node.name}`);
    await this.fileService.download(node);
    ref.dismiss();
  }

  async onDelete(node: FileNode) {
    await this.fileService.delete(node);
    const directory = this.directory$.value;
    if (directory) {
      this.directory$.next(directory.withoutChild(node));
    }
  }
}
