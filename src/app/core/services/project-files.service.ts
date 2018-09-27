import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { DownloaderService } from '@app/core/services/downloader.service';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Directory, File, FileNode, FileNodeType, FileVersion, fromJson } from '../models/file-node';
import { PloApiService } from './http/plo-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectFilesService {

  constructor(
    private ploApi: PloApiService,
    private downloader: DownloaderService,
    private authService: AuthenticationService
  ) {
  }

  getDirectory(projectId: string, dirId?: string): Observable<Directory> {
    return this
      .ploApi
      .get<Directory>(`/projects/${projectId}/files${dirId ? `/${dirId}` : ''}`)
      .pipe(map(node => fromJson({ ...node, projectId: projectId }) as Directory));
  }

  async createDirectory(parent: Directory, name: string): Promise<Directory> {
    const dir = await this.ploApi
      .post(`/projects/${parent.projectId}/files`, {
        projectId: parent.projectId,
        parent: parent.id,
        name,
        type: FileNodeType.Directory
      })
      .toPromise();

    const owner = await this.authService.getCurrentUser()!;
    return fromJson({
      ...dir,
      projectId: parent.projectId,
      createdAt: DateTime.local().toISO(),
      owner
    }) as Directory;
  }

  async download(file: File, version?: FileVersion) {
    const url = await this.getDownloadUrl(file, version);
    await this.downloader.downloadUrl(url, file.name);
  }

  private async getDownloadUrl(file: File, version?: FileVersion): Promise<string> {
    const result = await this.ploApi
      .get<{url: string}>(`/projects/${file.projectId}/files/download/${file.id}`, {
        params: {
          fileVersionId: version ? version.id : file.versions[0].id
        }
      })
      .toPromise();

    return result.url;
  }

  async delete(node: FileNode): Promise<void> {
    await this.ploApi.delete(`/projects/${node.projectId}/files/${node.id}`).toPromise();
  }
}
