import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GroupsComponent } from 'src/app/platform/units/groups/groups.component';

const routes: Routes = [
  { path: '', component: GroupsComponent }
];

@NgModule({
  declarations: [GroupsComponent],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class GroupsModule {}
