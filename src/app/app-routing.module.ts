import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodoAppComponent } from './todo-app/todo-app.component';

const routes: Routes = [
  {
    path: 'todos',
    component: TodoAppComponent
  },
  {
    path: 'todos/:type',
    component: TodoAppComponent
  },
  {
    path: '',
    redirectTo: '/todos',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
