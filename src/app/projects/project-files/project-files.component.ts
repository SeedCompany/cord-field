import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleAware } from '@app/core/decorators';
import { Directory, FileKeys, FileNode, FileNodeCategory, UploadFile } from '@app/core/models/files';
import { SUPPORTS_DOWNLOADS } from '@app/core/services/downloader.service';
import { FilesService } from '@app/core/services/files.service';
import { filterRequired, skipEmptyViewState } from '@app/core/util';
import { CreateDirectoryDialogComponent } from '@app/projects/project-files/create-directory-dialog/create-directory-dialog.component';
import { FileRenameDialogComponent } from '@app/projects/project-files/file-rename-dialog/file-rename-dialog.component';
import { OverwriteFileWarningComponent } from '@app/projects/project-files/overwrite-file-warning/overwrite-file-warning.component';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-files',
  templateUrl: './project-files.component.html',
  styleUrls: ['./project-files.component.scss'],
})
@TitleAware()
export class ProjectFilesComponent extends SubscriptionComponent implements AfterViewInit {

  readonly displayedColumns: FileKeys[] = ['name', 'createdAt', 'owner', 'category', 'size'];
  readonly pageSizeOptions = [10, 25, 50];
  readonly FileNodeCategory = FileNodeCategory;
  readonly supportsDownloads = SUPPORTS_DOWNLOADS;

  directory$ = new BehaviorSubject<Directory | null>(null);
  dataSource = new MatTableDataSource<FileNode>();
  totalCount = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private activatedRoute: ActivatedRoute,
              private fileService: FilesService,
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
        filterRequired(),
      );
  }

  get title() {
    return this.directory.pipe(
      startWith({ name: null }),
      map(dir => [dir.name, 'Files']),
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    combineLatest(
      this.activatedRoute.queryParams,
      this.projectViewState.project.pipe(skipEmptyViewState()),
    )
      .pipe(
        map(([params, project]) => params.parent || project.id),
        switchMap(id => this.fileService.getDirectory(id)),
        takeUntil(this.unsubscribe),
      )
      .subscribe(this.directory$);

    this.directory.subscribe(directory => {
      this.dataSource.data = directory.children;
      this.totalCount = directory.children.length;
    });
  }

  onNodeClick(node: FileNode): void {
    if (node.isFile()) {
      return;
    }
    this.router.navigate(['.'], {
      queryParams: { parent: node.id },
      relativeTo: this.activatedRoute,
    });
  }

  onUpload(event: Event) {
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

    if (!directory.children.some(node => node.name === uploadFile.name)) {
      this.uploadFile(uploadFile, directory);
      return;
    }

    OverwriteFileWarningComponent
      .open(this.dialog, directory, uploadFile)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(name => {
        if (!name) {
          return;
        }
        this.uploadFile(uploadFile, directory, name);
      });
  }

  private async uploadFile(uploadFile: UploadFile, directory: Directory, name = uploadFile.name) {
    const ref = this.snackBar.open(`Uploading ${name}`);
    const notify = (message: string) => {
      ref.dismiss();
      this.snackBar.open(`${message} ${name}`, undefined, {duration: 3000});
    };

    try {
      const file = await this.fileService.upload(uploadFile, name, directory);
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

  async onRename(node: FileNode) {
    const directory = this.directory$.value;
    if (!directory) {
      return;
    }

    FileRenameDialogComponent
      .open(this.dialog, directory, node)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(newNode => {
        if (!newNode) {
          return;
        }
        this.directory$.next(directory.withChild(newNode));
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
