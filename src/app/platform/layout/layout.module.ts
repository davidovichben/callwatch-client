import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { SidebarComponent } from './sidebar/sidebar.component';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [SidebarComponent, ContentComponent],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatIconModule,
    MatMenuModule
  ],
  exports: [SidebarComponent, ContentComponent]
})
export class LayoutModule {}
