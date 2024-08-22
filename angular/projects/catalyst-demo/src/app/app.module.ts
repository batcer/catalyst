import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CatalystModule } from '@haiilo/catalyst-angular';
import { FormlyModule } from '@ngx-formly/core';
import { CatalystFormlyModule } from '../../../catalyst-formly/src';
import { AppComponent } from './app.component';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    CatalystModule.forRoot(),
    CatalystFormlyModule,
    CatalystModule
  ],
  declarations: [AppComponent, DialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
