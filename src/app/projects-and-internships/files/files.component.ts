import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractViewState } from '@app/core/abstract-view-state';
import { TitleAware } from '@app/core/decorators';
import { Directory, FileKeys, FileNode, FileNodeCategory, UploadFile } from '@app/core/models/files';
import { Internship } from '@app/core/models/internship';
import { Project } from '@app/core/models/project';
import { SUPPORTS_DOWNLOADS } from '@app/core/services/downloader.service';
import { FilesService } from '@app/core/services/files.service';
import { filterRequired, skipEmptyViewState } from '@app/core/util';
import { DeleteFileWarningComponent } from '@app/projects-and-internships/files/delete-file-warning/delete-file-warning.component';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { BehaviorSubject, combineLatest, EMPTY, Observable } from 'rxjs';
import { catchError, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { CreateDirectoryDialogComponent } from './create-directory-dialog/create-directory-dialog.component';
import { FileRenameDialogComponent } from './file-rename-dialog/file-rename-dialog.component';
import { OverwriteFileWarningComponent } from './overwrite-file-warning/overwrite-file-warning.component';

@Component({
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
@TitleAware()
export class FilesComponent extends SubscriptionComponent implements AfterViewInit {

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
              private viewState: AbstractViewState<Project | Internship, unknown>,
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
      this.viewState.subject.pipe(skipEmptyViewState()),
    )
      .pipe(
        switchMap(([params, subject]) =>
          this.fileService.getDirectory(params.parent || subject.id)
            .pipe(
              catchError(err => {
                if (err instanceof HttpErrorResponse && err.status === 404) {
                  this.snackBar.open('Could not find folder', undefined, { duration: 3000 });

                  // If invalid parameter given, go to root
                  if (params.parent && params.parent !== subject.id) {
                   this.router.navigate(['.'], {
                     relativeTo: this.activatedRoute,
                   });
                 }
                } else {
                  this.snackBar.open('Failed to fetch folder', undefined, { duration: 3000 });
                }
                return EMPTY;
              }),
            ),
        ),
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
    try {
      await this.fileService.download(node);
    } catch (e) {
      ref.dismiss();
      this.snackBar.open(`Failed to download ${node.name}`, undefined, { duration: 3000 });
      return;
    }
    ref.dismiss();
  }

  async onDelete(node: FileNode) {
    DeleteFileWarningComponent
      .open(this.dialog, node)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(async val => {
        if (!val) {
          return;
        }
        await this.fileService.delete(node);
        const directory = this.directory$.value;
        if (directory) {
          this.directory$.next(directory.withoutChild(node));
        }
      });
  }
}
