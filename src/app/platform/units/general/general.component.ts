import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';
import { UnitStateService } from 'src/app/_shared/services/state/unit-state.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.styl']
})
export class GeneralComponent implements OnInit, OnDestroy {

  readonly sub = new Subscription();

  unit = new UnitModel();

  permissions = [];

  isRootUnit = false;

  constructor(private route: ActivatedRoute,
              private userSession: UserSessionService,
              private notifications: NotificationService,
              private unitService: UnitService,
              private unitStateService: UnitStateService) {}

  ngOnInit(): void {
    this.sub.add(this.route.data.subscribe(data => {
      this.unit = this.route.parent.parent.snapshot.data.unit;

      this.isRootUnit = this.unit.id === 'root';
    }));
  }

  hasPermission(module: string, action: string): boolean {
    return this.userSession.hasPermission(module, action);
  }

  submit(form: NgForm): void {
    Object.assign(form.value, { parent: this.unit.parent.id });
    this.unitService.updateUnit(this.unit.id, form.value).then(response => {
      if (response) {
        this.notifications.success();
        this.unitStateService.changeUnit()
      }
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
