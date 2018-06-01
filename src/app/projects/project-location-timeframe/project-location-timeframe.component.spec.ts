import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '../../core/core.module';
import { AuthenticationStorageService } from '../../core/services/authentication-storage.service';
import { PloApiService } from '../../core/services/http/plo-api.service';
import { ProjectService } from '../../core/services/project.service';
import { SharedModule } from '../../shared/shared.module';
import { ProjectViewStateService } from '../project-view-state.service';
import { ProjectLocationTimeframeComponent } from './project-location-timeframe.component';


describe('ProjectLocationTimeframeComponent', () => {
  let component: ProjectLocationTimeframeComponent;
  let fixture: ComponentFixture<ProjectLocationTimeframeComponent>;

  const startDate = new Date('2018-07-02');
  const endDate = new Date('2050-07-02');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CoreModule,
        HttpClientModule,
        SharedModule
      ],
      declarations: [
        ProjectLocationTimeframeComponent
      ],
      providers: [AuthenticationStorageService,
        PloApiService,
        ProjectService,
        ProjectViewStateService
      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectLocationTimeframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('start date should be less than end date ', () => {
    component.form.controls['mouStart'].setValue(startDate);
    component.form.controls['mouEnd'].setValue(endDate);
    const result = component.dateValidator(component.form);
    expect(result).toBeNull();
  });

  it('start date and end date should not be equal', () => {
    component.form.controls['mouStart'].setValue(startDate);
    component.form.controls['mouEnd'].setValue(startDate);
    const result = component.dateValidator(component.form);
    expect(result!.invalidDates).toBeTruthy();
  });

  it('End date should not be less than start date', () => {
    component.form.controls['mouStart'].setValue(endDate);
    component.form.controls['mouEnd'].setValue(startDate);
    const result = component.dateValidator(component.form);
    expect(result!.invalidDates).toBeTruthy();
  });
});
