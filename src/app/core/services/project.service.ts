import { Injectable } from '@angular/core';
import { PloApiService } from './http/plo-api.service';

@Injectable()
export class ProjectService {

  constructor(private ploApiSerivce: PloApiService) {
  }

  getProjects(): any {
    return ELEMENT_DATA;
  }
}

const ELEMENT_DATA: any = [
  {
    lastModified: 1522247593559,
    name: 'Hydrogen 1',
    languages: ['telugu', 'hindi'],
    type: 'translation',
    status: 'active'
  },
  {
    lastModified: 1522668287589,
    name: 'Hydrogen 2',
    languages: [],
    type: 'internship',
    status: 'rejected'
  },
  {
    lastModified: 1522668320744,
    name: 'Hydrogen 3',
    languages: ['telugu', 'hindi'],
    type: 'internship',
    status: 'completed'
  },
  {
    lastModified: 1522247593559,
    name: 'Hydrogen 4',
    languages: ['telugu', 'hindi'],
    type: 'internship',
    status: 'not doing'
  },
  {
    lastModified: 1522247593559,
    name: 'Hydrogen 5',
    languages: ['telugu', 'hindi'],
    type: 'translation',
    status: 'archived'
  },
  {
    lastModified: 1522668320744,
    name: 'Hydrogen 6',
    languages: ['telugu', 'hindi'],
    type: 'translation',
    status: 'pending approval'
  },
  {
    lastModified: 1522247593559,
    name: 'Hydrogen 7',
    languages: ['telugu', 'hindi', 'panjabi'],
    type: 'internship',
    status: 'active'
  },
  {
    lastModified: 1522247593559,
    name: 'Hydrogen 8',
    languages: ['telugu', 'hindi'],
    type: 'translation',
    status: 'active'
  },
  {
    lastModified: 1522247593559,
    name: 'Hydrogen 9',
    languages: ['telugu', 'hindi'],
    type: 'internship',
    status: 'rejected'
  },
  {
    lastModified: 1522247593559,
    name: 'Hydrogen 10',
    languages: ['telugu', 'hindi'],
    type: 'translation',
    status: 'active'
  },
  {
    lastModified: 1522247593559,
    name: 'Hydrogen 11',
    languages: ['telugu', 'hindi'],
    type: 'translation',
    status: 'archived'
  },
  {
    lastModified: 1522668287589,
    name: 'Hydrogen 12',
    languages: ['telugu', 'hindi'],
    type: 'translation',
    status: 'rejected'
  },
  {
    lastModified: 1522247593559,
    name: 'Hydrogen 13',
    languages: ['telugu', 'hindi', 'panjabi'],
    type: 'internship',
    status: 'active'
  },
  {
    lastModified: 1522247593559,
    name: 'Hydrogen 14',
    languages: ['telugu', 'hindi'],
    type: 'translation',
    status: 'archived'
  }
];
