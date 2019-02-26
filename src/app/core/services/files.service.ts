import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Directory, File, FileNode, FileNodeType, FileVersion, fromJson, UploadFile } from '@app/core/models/files';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { DownloaderService } from '@app/core/services/downloader.service';
import { clone } from '@app/core/util';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PloApiService } from './http/plo-api.service';

@Injectable({
  providedIn: 'root',
})
export class FilesService {

  constructor(
    private ploApi: PloApiService,
    private downloader: DownloaderService,
    private http: HttpClient,
    private authService: AuthenticationService,
  ) {
  }

  getDirectory(dirId: string): Observable<Directory> {
    return this
      .ploApi
      .get<Directory>(`/files/${dirId}`)
      .pipe(map(node => fromJson(node)));
  }

  async rename<T extends FileNode>(newName: string, node: T, parent: Directory): Promise<T> {
    await this.ploApi
      .put(`/files/${node.id}`, {
        parentId: parent.id,
        name: newName,
      })
      .toPromise();

    const cloned = clone(node);
    cloned.name = newName;
    return cloned;
  }

  async createDirectory(parent: Directory, name: string): Promise<Directory> {
    const dir = await this.ploApi
      .post<Directory>(`/files`, {
        parentId: parent.id,
        name,
        type: FileNodeType.Directory,
      })
      .toPromise();

    const owner = await this.authService.getCurrentUser()!;
    return fromJson({
      ...dir,
      createdAt: DateTime.local().toISO(),
      owner,
    });
  }

  async upload(uploadFile: UploadFile, name: string, parent: Directory): Promise<File> {
    const { file: tempFile, preSignedUrl, fileVersionId } = await this.createNode(uploadFile, name, parent).toPromise();
    await this.uploadToS3(preSignedUrl, uploadFile);
    return this.updateFileVersion(tempFile, fileVersionId).toPromise();
  }

  private createNode(uploadFile: UploadFile, name: string, parent: Directory) {
    return this.ploApi
      .post<File & { preSignedUrl: string, fileVersionId: string }>(`/files`, {
        name,
        parentId: parent.id,
        mimeType: uploadFile.type,
        type: FileNodeType.File,
      })
      .pipe(map(({ preSignedUrl, fileVersionId, ...file }) => ({
        file: fromJson(file),
        preSignedUrl,
        fileVersionId,
      })));
  }

  private async uploadToS3(preSignedUrl: string, uploadFile: UploadFile): Promise<void> {
    await this.http
      .put(preSignedUrl, uploadFile, {
        headers: {
          'Content-Type': uploadFile.type,
        },
        observe: 'response',
      })
      .toPromise();
  }

  /**
   * Tell PLO to fetch new file info from S3
   */
  private updateFileVersion(temp: File, versionId: string): Observable<File> {
    return this.ploApi
      .put<File>(`/files`, {
        fileId: temp.id,
        fileVersionId: versionId,
      })
      .pipe(map(file => fromJson(file)));
  }

  async download(file: File, version?: FileVersion) {
    const url = await this.getDownloadUrl(file, version);
    await this.downloader.downloadUrl(url, file.name);
  }

  private async getDownloadUrl(file: File, version?: FileVersion): Promise<string> {
    const result = await this.ploApi
      .get<{url: string}>(`/files/download/${file.id}`, {
        params: {
          fileVersionId: version ? version.id : file.versions[0].id,
        },
      })
      .toPromise();

    return result.url;
  }

  async delete(node: FileNode): Promise<void> {
    await this.ploApi.delete(`/files/${node.id}`).toPromise();
  }
}
