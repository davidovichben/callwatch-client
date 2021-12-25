import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { ExtensionGroupService } from 'src/app/_shared/services/http/extension-group.service';

import { ExtensionGroupModel } from 'src/app/_shared/models/extension-group.model';

@Component({
  selector: 'app-extensions-groups',
  templateUrl: './extensions-groups.component.html',
  styleUrls: ['./extensions-groups.component.styl']
})
export class ExtensionsGroupsComponent implements OnInit {

  readonly sub = new Subscription();

  parentRoute: ActivatedRoute;

  selects = {
    switchboards: [],
    routers: [],
    extensions: [],
    acds: []
  }

  extensionGroup: ExtensionGroupModel;
  unitId: number;

  isSubmitting = false;

  constructor(private route: ActivatedRoute, private router: Router,
              public userSession: UserSessionService,
              private notificationService: NotificationService,
              private extensionGroupService: ExtensionGroupService) {}

  ngOnInit(): void {
    this.parentRoute = this.route.parent.parent;
    this.sub.add(this.parentRoute.data.subscribe(() => this.setUnit()));

    this.selects = this.route.snapshot.data.selects;
  }

  private setUnit(): void {
    const unitId = this.parentRoute.snapshot.params.id;
    if (unitId === 'root') {
      this.router.navigate(['/platform', 'units']);
      return;
    }

    this.unitId = +unitId;

    this.extensionGroup = this.route.snapshot.data.extensionGroup;
    console.log(this.extensionGroup)
  }

  submit(form: NgForm): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.extensionGroupService.updateExtensionGroup(this.unitId, form.value).then(response => {
        if (response) {
          this.notificationService.success();
        }

        this.isSubmitting = false;
      })
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

