import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Directory, fromJson } from '../models/file-node';
import { PloApiService } from './http/plo-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectFilesService {

  constructor(private ploApi: PloApiService) {
  }

  getDirectory(projectId: string, dirId?: string): Observable<Directory> {
    return this
      .ploApi
      .get<Directory>(`/projects/${projectId}/files${dirId ? `/${dirId}` : ''}`)
      .pipe(map(node => fromJson({ ...node, projectId: projectId }) as Directory));
  }
}
