import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { Angulartics2Module } from 'angulartics2';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({appId: 'cord-field'}),
    BrowserAnimationsModule,
    TransferHttpCacheModule,
    HttpClientModule,
    Angulartics2Module.forRoot(),
    CoreModule.forRoot(),
    AppRoutingModule,
  ],
})
export class AppModule {
}
