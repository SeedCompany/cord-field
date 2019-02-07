import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Directory, File as CordFile, FileNode, FileNodeType, FileVersion, fromJson } from '@app/core/models/files';
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
export class ProjectFilesService {

  constructor(
    private ploApi: PloApiService,
    private downloader: DownloaderService,
    private http: HttpClient,
    private authService: AuthenticationService,
  ) {
  }

  getDirectory(projectId: string, dirId?: string): Observable<Directory> {
    return this
      .ploApi
      .get<Directory>(`/projects/${projectId}/files${dirId ? `/${dirId}` : ''}`)
      .pipe(map(node => fromJson({ ...node, projectId: projectId })));
  }

  async rename<T extends FileNode>(newName: string, node: T, parent: Directory): Promise<T> {
    await this.ploApi
      .put(`/projects/${node.projectId}/files/${node.id}`, {
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
      .post<Directory>(`/projects/${parent.projectId}/files`, {
        projectId: parent.projectId,
        parentId: parent.id,
        name,
        type: FileNodeType.Directory,
      })
      .toPromise();

    const owner = await this.authService.getCurrentUser()!;
    return fromJson({
      ...dir,
      projectId: parent.projectId,
      createdAt: DateTime.local().toISO(),
      owner,
    });
  }

  async upload(uploadFile: File, name: string, parent: Directory): Promise<CordFile> {
    const { file: tempFile, preSignedUrl, fileVersionId } = await this.createNode(uploadFile, name, parent).toPromise();
    await this.uploadToS3(preSignedUrl, uploadFile);
    return this.updateFileVersion(tempFile, fileVersionId).toPromise();
  }

  private createNode(uploadFile: File, name: string, parent: Directory) {
    return this.ploApi
      .post<CordFile & { preSignedUrl: string, fileVersionId: string }>(`/projects/${parent.projectId}/files`, {
        name,
        parentId: parent.id,
        mimeType: uploadFile.type,
        type: FileNodeType.File,
      })
      .pipe(map(({ preSignedUrl, fileVersionId, ...file }) => ({
        file: fromJson({ ...file, projectId: parent.projectId }),
        preSignedUrl,
        fileVersionId,
      })));
  }

  private async uploadToS3(preSignedUrl: string, uploadFile: File): Promise<void> {
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
  private updateFileVersion(temp: CordFile, versionId: string): Observable<CordFile> {
    return this.ploApi
      .put<CordFile>(`/projects/${temp.projectId}/files`, {
        fileId: temp.id,
        fileVersionId: versionId,
      })
      .pipe(map(file => fromJson({ ...file, projectId: temp.projectId })));
  }

  async download(file: CordFile, version?: FileVersion) {
    const url = await this.getDownloadUrl(file, version);
    await this.downloader.downloadUrl(url, file.name);
  }

  private async getDownloadUrl(file: CordFile, version?: FileVersion): Promise<string> {
    const result = await this.ploApi
      .get<{url: string}>(`/projects/${file.projectId}/files/download/${file.id}`, {
        params: {
          fileVersionId: version ? version.id : file.versions[0].id,
        },
      })
      .toPromise();

    return result.url;
  }

  async delete(node: FileNode): Promise<void> {
    await this.ploApi.delete(`/projects/${node.projectId}/files/${node.id}`).toPromise();
  }
}
