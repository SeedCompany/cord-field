import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CoreTestModule } from '@app/core/core-test.module';
import { DateTime } from 'luxon';
import { of as observableOf } from 'rxjs';
import { first, skip } from 'rxjs/operators';
import { CoreModule } from '../core/core.module';
import { Language } from '../core/models/language';
import { Location } from '../core/models/location';
import { Partnership, PartnershipAgreementStatus } from '../core/models/partnership';
import { Project } from '../core/models/project';
import { ProjectRole } from '../core/models/project-role';
import { TeamMember } from '../core/models/team-member';
import { User } from '../core/models/user';
import { ProjectService } from '../core/services/project.service';
import { ModifiedProject, ProjectViewStateService } from './project-view-state.service';

describe('ProjectViewStateService', () => {
  let viewState: ProjectViewStateService;
  let projectService: ProjectService;

  const project = Project.fromJson({id: 'id'});

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientModule,
        CoreTestModule,
      ],
      providers: [
        ProjectViewStateService,
      ],
    });

    viewState = TestBed.get(ProjectViewStateService);
    projectService = TestBed.get(ProjectService);
    spyOn(projectService, 'getProject').and.returnValue(observableOf(project));
  });

  it('initial project should be empty project', async () => {
    const p: Project = await viewState.project.pipe(first()).toPromise();
    expect(p instanceof Project).toBeTruthy();
  });

  it('Given new project ID -> fetch project', async () => {
    viewState.onNewId('id');
    const p: Project = await viewState.project.pipe(skip(1), first()).toPromise();
    expect(p instanceof Project).toBeTruthy();
    expect(p.id).toBe('id');
  });

  it('Save', async () => {
    viewState.onNewId('id');

    // wait for load to finish
    await viewState.project.pipe(skip(1), first()).toPromise();

    const partnershipToRemove = Partnership.fromJson({
      organization: {
        id: 'old org id',
        name: 'old org',
      },
    });
    project.partnerships = [partnershipToRemove];

    const languageToRemove = Language.fromJson({id: 'old id'});
    project.languages = [languageToRemove];

    const teamMemberToRemove = TeamMember.new(User.fromJson({id: 'old user id'}), [ProjectRole.Writer]);
    project.team = [teamMemberToRemove];

    viewState.change({
      mouStart: DateTime.local(2018, 1, 1),
      mouEnd: DateTime.local(2018, 1, 1),
      location: Location.fromJson({id: 'location id'}),
      languages: {
        add: Language.fromJson({id: 'language id'}),
        remove: languageToRemove,
      },
      partnerships: {
        add: Partnership.fromOrganization({
          id: 'org id',
          name: 'org',
        }),
        remove: partnershipToRemove,
      },
      team: {
        add: TeamMember.new(User.fromJson({id: 'user id'}), [ProjectRole.Writer]),
        remove: teamMemberToRemove,
      },
    });
    const serverChanges = {
      mouStart: DateTime.local(2018, 1, 1),
      mouEnd: DateTime.local(2018, 1, 1),
      locationId: 'location id',
      languages: {
        add: ['language id'],
        remove: ['old id'],
      },
      partnerships: {
        add: [
          {
            organizationId: 'org id',
            mouStart: null,
            mouEnd: null,
            agreementStatus: PartnershipAgreementStatus.NotAttached,
            mouStatus: PartnershipAgreementStatus.NotAttached,
            types: [],
          },
        ],
        remove: [
          'old org id',
        ],
      },
      team: {
        add: [
          {
            userId: 'user id',
            roles: [ProjectRole.Writer],
          },
        ],
        remove: [
          'old user id',
        ],
      },
    } as ModifiedProject;
    const actualServerChanges = (viewState as any).changeEngine.getModifiedForServer(project);

    spyOn(projectService, 'save').and.stub();
    await viewState.save();
    expect(projectService.save).toHaveBeenCalledWith(project.id, serverChanges);
  });
});
