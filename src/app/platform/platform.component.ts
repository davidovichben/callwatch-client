import { Component } from '@angular/core';
import { SidebarComponent } from '../_shared/components/layout/sidebar/sidebar.component';
import { ContentComponent } from '../_shared/components/layout/content/content.component';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.sass'],
  standalone: true,
  imports: [SidebarComponent, ContentComponent]
})
export class PlatformComponent {
  sidebarToggleState = 'opened';
}
