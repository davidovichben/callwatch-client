import { Component } from '@angular/core';

import { SidebarComponent } from '../_shared/components/layout/sidebar/sidebar.component';
import { ContentComponent } from '../_shared/components/layout/content/content.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [ContentComponent, SidebarComponent],
  standalone: true
})
export class AdminComponent {
  sidebarToggleState = 'opened';
}
