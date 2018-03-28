import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TasksRoutingModule } from './tasks-routing.module';

@NgModule({
  imports: [
    SharedModule,
    TasksRoutingModule
  ],
  declarations: []
})
export class TasksModule {
}
