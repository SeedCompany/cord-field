import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirtyGuard } from '@app/core/route-guards/dirty.guard';
import { NotImplementedGuard, notImplementedRoute } from '@app/core/route-guards/not-implemented.guard';
import { InternshipOverviewComponent } from './internship-overview/internship-overview.component';
import { InternshipComponent } from './internship/internship.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', canActivate: [NotImplementedGuard] },
  {
    path: ':id',
    component: InternshipComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: InternshipOverviewComponent, data: { acceptDirty: true }, canDeactivate: [DirtyGuard] },
      { path: 'forms', data: { acceptDirty: true }, canDeactivate: [DirtyGuard], canActivate: [NotImplementedGuard] },
      {
        path: 'engagements',
        children: [
          { path: ':id', canDeactivate: [DirtyGuard], canActivate: [NotImplementedGuard] },
        ],
        canActivate: [NotImplementedGuard],
      },
      { path: 'budget', data: { acceptDirty: true }, canDeactivate: [DirtyGuard], canActivate: [NotImplementedGuard] },
      notImplementedRoute('files'),
      notImplementedRoute('team'),
    ],
    canDeactivate: [DirtyGuard],
    canActivateChild: [DirtyGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InternshipsRoutingModule {
}
