import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { SidebarComponent } from './sidebar/sidebar.component';
import { ContentComponent } from './content/content.component';
import { LangSelectModule } from 'src/app/_shared/components/lang-select/lang-select.module';

@NgModule({
  declarations: [SidebarComponent, ContentComponent],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    LangSelectModule
  ],
  exports: [SidebarComponent, ContentComponent]
})
export class LayoutModule {}
