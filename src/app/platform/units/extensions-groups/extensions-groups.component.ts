import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-extensions-groups',
  templateUrl: './extensions-groups.component.html'
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

  unit: UnitModel;

  isSubmitting = false;

  constructor(private route: ActivatedRoute, private router: Router,
              public userSession: UserSessionService,
              private notificationService: NotificationService,
              private unitService: UnitService) {}

  ngOnInit(): void {
    this.parentRoute = this.route.parent.parent;
    this.sub.add(this.parentRoute.data.subscribe(() => this.setUnit()));

    this.selects = this.route.snapshot.data.selects;
  }

  private setUnit(): void {
    this.unit = this.route.snapshot.data.unit;
    this.unit.id = +this.parentRoute.snapshot.params.id;
    if (this.unit.id === 'root') {
      this.router.navigate(['/platform', 'units']);
      return;
    }
  }

  submit(form: NgForm): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.unitService.updateExtensionGroup(this.unit.id, form.value).then(response => {
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

