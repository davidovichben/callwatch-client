import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { ExtensionGroupService } from 'src/app/_shared/services/http/extension-group.service';
import { SwitchboardService } from 'src/app/_shared/services/http/switchboard.service';

import { ExtensionGroupModel } from 'src/app/_shared/models/extension-group.model';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-extensions-groups',
  templateUrl: './extensions-groups.component.html',
  styleUrls: ['./extensions-groups.component.sass'],
  animations: [Fade]
})
export class ExtensionsGroupsComponent implements OnInit {

  @ViewChild('form') form: NgForm;

  readonly sub = new Subscription();

  parentRoute: ActivatedRoute;

  selects = {
    switchboards: [],
    routers: [],
    extensions: null,
    acds: null
  }

  isAcdsExtensionLoading = false;

  extensionGroup: ExtensionGroupModel;
  unitId: number;

  isSubmitting = false;

  constructor(private route: ActivatedRoute, private router: Router,
              public userSession: UserSessionService,
              private notificationService: NotificationService,
              private extensionGroupService: ExtensionGroupService,
              private switchboardService: SwitchboardService) {}

  ngOnInit(): void {
    this.parentRoute = this.route.parent.parent;
    this.sub.add(this.parentRoute.data.subscribe(() => {
      this.setUnit();
    }));

    this.selects.switchboards = this.route.snapshot.data.selects.switchboards;
    this.selects.routers = this.route.snapshot.data.selects.routers;
  }

  private setUnit(): void {
    const unitId = this.parentRoute.snapshot.params.id;
    if (unitId === 'root') {
      this.router.navigate(['/platform', 'units']);
      return;
    }

    this.unitId = +unitId;

    this.extensionGroup = this.route.snapshot.data.extensionGroup;
  }

  switchboardSelected(switchboardId: number): void {
    if (switchboardId) {
      this.isAcdsExtensionLoading = true;
      this.switchboardService.getExtensionsAndAcds(switchboardId, this.unitId).then(response => {
        if (response) {
          this.selects.extensions = response.extensions;
          this.selects.acds = response.acds;
        }

        this.isAcdsExtensionLoading = false;
        setTimeout(() => this.form.form.markAsPristine(), 1000);
      })
    } else {
      this.selects.extensions = null;
      this.selects.acds = null;
    }
  }

  submit(form: NgForm): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.extensionGroupService.updateExtensionGroup(this.unitId, form.value).then(response => {
        if (response) {
          this.notificationService.success();
        }

        this.form.form.markAsPristine();
        this.isSubmitting = false;
      })
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

