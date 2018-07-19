import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { notImplementedRoute } from '../core/route-guards/not-implemented.guard';

const routes: Routes = [
  notImplementedRoute('Organization views have not been implemented yet')
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationsRoutingModule {
}
