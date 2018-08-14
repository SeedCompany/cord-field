import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileList, FileNode } from '../models/file-node';
import { HttpParams } from './http/abstract-http-client';
import { PloApiService } from './http/plo-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectFilesService {

  constructor(private ploApi: PloApiService) {
  }

  getFiles(id: string,
           parentId: string,
           sort: keyof FileNode = 'createdAt',
           order: SortDirection = 'desc',
           skip = 0,
           limit = 10): Observable<FileList> {

    const params: HttpParams = {
      sort,
      skip: skip.toString(),
      limit: limit.toString(),
      order
    };
    if (parentId) {
      params.parentId = parentId;
    }
    return this
      .ploApi
      .get<FileNode[]>(`/projects/${id}/files`, {params, observe: 'response'})
      .pipe(map((response: HttpResponse<FileNode[]>) => {
        return {
          files: FileNode.fromJsonArray(response.body),
          total: Number(response.headers.get('x-sc-total-count')) || 0
        };
      }));
  }

}
