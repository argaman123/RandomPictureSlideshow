import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {PictureComponent} from "./components/picture/picture.component";
import {NgOptimizedImage} from "@angular/common";
import {MatIconModule} from '@angular/material/icon';
import {SettingsComponent} from "./dialogs/settings/settings.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatChipsModule} from "@angular/material/chips";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSelectModule} from "@angular/material/select";
import {KeysPipe} from "./pipes/keys.pipe";

@NgModule({
  declarations: [
    AppComponent,
    PictureComponent,
    SettingsComponent,
    KeysPipe
  ],
    imports: [
        BrowserModule,
        NgOptimizedImage,
        MatIconModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        BrowserAnimationsModule,
        MatChipsModule,
        MatSlideToggleModule,
        MatSelectModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
