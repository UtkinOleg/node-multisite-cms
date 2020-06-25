import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditrecordsComponent } from './editrecords/editrecords.component';
import { OptionsComponent } from './options/options.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'edit/page', 
    pathMatch: 'full' 
  },
  {
    path: 'edit/:type',
    component: EditrecordsComponent
  },
  {
    path: 'options',
    component: OptionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
