import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Directory, FileNodeType, fromJson } from '../models/file-node';
import { PloApiService } from './http/plo-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectFilesService {

  constructor(
    private ploApi: PloApiService,
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
}
