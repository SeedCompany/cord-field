import { Injectable } from '@angular/core';
import { Project, ProjectStatus, ProjectType } from '../models/project';
import { PloApiService } from './http/plo-api.service';

@Injectable()
export class ProjectService {

  constructor(private ploApiSerivce: PloApiService) {
  }

  getProjects(): Project[] {
    return ELEMENT_DATA;
  }
}

const ELEMENT_DATA: Project[] = [
  {
    id: '5ac43a72ed4df48004da5f88',
    name: 'Hydrogen 1',
    languages: ['Telugu', 'Hindi'],
    type: ProjectType.Translation,
    status: ProjectStatus.Active,
    updatedAt: '2018-03-28T14:33:13.559Z'
  },
  {
    id: '5ac43a72301ebafb71fb3294',
    name: 'Hydrogen 2',
    languages: [],
    type: ProjectType.Internship,
    status: ProjectStatus.Rejected,
    updatedAt: '2018-04-02T11:24:47.589Z'
  },
  {
    id: '5ac43a72fa2f0c38dcb55a58',
    name: 'Hydrogen 3',
    languages: ['Telugu', 'Hindi'],
    type: ProjectType.Internship,
    status: ProjectStatus.Completed,
    updatedAt: '2018-04-02T11:25:20.744Z'
  },
  {
    id: '5ac43a723edc097db9a0b7a7',
    name: 'Hydrogen 4',
    languages: ['Telugu', 'Hindi'],
    type: ProjectType.Internship,
    status: ProjectStatus.InDevelopment,
    updatedAt: '2018-03-28T14:33:13.559Z'
  },
  {
    id: '5ac43a7262f47400f221a4e1',
    name: 'Hydrogen 5',
    languages: ['Telugu', 'Hindi'],
    type: ProjectType.Translation,
    status: ProjectStatus.Inactive,
    updatedAt: '2018-03-28T14:33:13.559Z'
  },
  {
    id: '5ac43a72899a0c571cd26b46',
    name: 'Hydrogen 6',
    languages: ['Telugu', 'Hindi'],
    type: ProjectType.Translation,
    status: ProjectStatus.InDevelopment,
    updatedAt: '2018-04-02T11:25:20.744Z'
  },
  {
    id: '5ac43a7287e634f1670bacab',
    name: 'Hydrogen 7',
    languages: ['Telugu', 'Hindi', 'Panjabi'],
    type: ProjectType.Internship,
    status: ProjectStatus.Active,
    updatedAt: '2018-03-28T14:33:13.559Z'
  },
  {
    id: '5ac43a72091d23adac09ed40',
    name: 'Hydrogen 8',
    languages: ['Telugu', 'Hindi'],
    type: ProjectType.Translation,
    status: ProjectStatus.Active,
    updatedAt: '2018-03-28T14:33:13.559Z'
  },
  {
    id: '5ac43a72b8b99d24efe3bd92',
    name: 'Hydrogen 9',
    languages: ['Telugu', 'Hindi'],
    type: ProjectType.Internship,
    status: ProjectStatus.Rejected,
    updatedAt: '2018-03-28T14:33:13.559Z'
  },
  {
    id: '5ac43a723875983e3be8ce43',
    name: 'Hydrogen 10',
    languages: ['Telugu', 'Hindi'],
    type: ProjectType.Translation,
    status: ProjectStatus.Active,
    updatedAt: '2018-03-28T14:33:13.559Z'
  },
  {
    id: '5ac43a722188e0de0dcdd5ac',
    name: 'Hydrogen 11',
    languages: ['Telugu', 'Hindi'],
    type: ProjectType.Translation,
    status: ProjectStatus.Inactive,
    updatedAt: '2018-03-28T14:33:13.559Z'
  },
  {
    id: '5ac43a722d2ccb0152a4296d',
    name: 'Hydrogen 12',
    languages: ['Telugu', 'Hindi'],
    type: ProjectType.Translation,
    status: ProjectStatus.Rejected,
    updatedAt: '2018-04-02T11:24:47.589Z'
  },
  {
    id: '5ac43a72b8509806522f2f19',
    name: 'Hydrogen 13',
    languages: ['Telugu', 'Hindi', 'Panjabi'],
    type: ProjectType.Internship,
    status: ProjectStatus.Active,
    updatedAt: '2018-03-28T14:33:13.559Z'
  },
  {
    id: '5ac43a72e87bb4338c8dbd05',
    name: 'Hydrogen 14',
    languages: ['Telugu', 'Hindi'],
    type: ProjectType.Translation,
    status: ProjectStatus.Inactive,
    updatedAt: '2018-03-28T14:33:13.559Z'
  }
];
