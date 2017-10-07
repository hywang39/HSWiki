import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';


import {AppComponent} from './app.component';
import {FilterComponent} from './filter.component';
import {MainComponent} from './main.component';
import {PaginationComponent} from './pagination.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {FilterPipe} from './filter.pipe';

@NgModule({

  declarations: [
    AppComponent,
    FilterComponent,
    MainComponent,
    PaginationComponent,
    FilterPipe,
  ],

  imports: [
    HttpModule,
    BrowserModule,
    HttpClientModule,
    NgxPaginationModule,
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
