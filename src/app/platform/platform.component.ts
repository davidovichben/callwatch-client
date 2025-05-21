import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentComponent } from '../_shared/components/layout/content/content.component';
import { SidebarComponent } from '../_shared/components/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.sass'],
  standalone: true,
  imports: [SidebarComponent, ContentComponent]
})
export class PlatformComponent implements OnInit {
  sidebarToggleState = 'opened';
  unreadNotificationsCount = 0;

  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.unreadNotificationsCount = this.route.snapshot.data['unreadNotificationsCount'];
  }
}
