import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { Angulartics2 } from 'angulartics2';

@NgModule({
  imports: [
    HttpClientTestingModule,
  ],
  providers: [
    { provide: Angulartics2, useValue: null },
  ],
})
export class CoreTestModule {
}
