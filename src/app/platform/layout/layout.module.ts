import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { LocaleSelectModule } from 'src/app/_shared/components/locale-select/locale-select.module';

import { SidebarComponent } from './sidebar/sidebar.component';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [SidebarComponent, ContentComponent],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    LocaleSelectModule,
    MatIconModule
  ],
  exports: [SidebarComponent, ContentComponent]
})
export class LayoutModule {}
