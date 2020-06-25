import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditrecordsComponent } from './editrecords/editrecords.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { confirmDialog } from './dialog-confirm/dialog-confirm';
import { helpDialog } from './dialog-help/dialog-help';
import { OptionsComponent } from './options/options.component';

@NgModule({
  declarations: [
    AppComponent,
    EditrecordsComponent,
    confirmDialog,
    helpDialog,
    OptionsComponent
  ],
  entryComponents: [
    confirmDialog,
    helpDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDividerModule,
    MatTabsModule,
    MatDialogModule, 
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    NgxSummernoteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
