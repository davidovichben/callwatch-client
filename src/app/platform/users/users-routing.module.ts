import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('src/app/platform/users/users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'groups',
    loadChildren: () => import('src/app/platform/users/groups/groups.module').then(m => m.GroupsModule)
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class UsersRoutingModule {}
