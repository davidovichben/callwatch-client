import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.styl']
})
export class PlatformComponent implements OnInit {

  sidebarToggleState = 'opened';

  constructor(private route: ActivatedRoute, private userSession: UserSessionService) {}

  ngOnInit() {
    const permissions = this.route.snapshot.data.permissions;
    this.userSession.setPermissions(permissions);
  }
}
