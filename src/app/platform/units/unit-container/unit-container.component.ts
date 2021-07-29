import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { UnitModel } from 'src/app/_shared/models/unit.model';

@Component({
  selector: 'app-unit-container',
  templateUrl: './unit-container.component.html',
  styleUrls: ['./unit-container.component.styl']
})
export class UnitContainerComponent implements OnInit, OnDestroy {

  @Input() unit: UnitModel;

  @Output() loadedUnits = new EventEmitter();

  readonly sub = new Subscription();

  isActive = false;
  isToggled = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private notifications: NotificationService,
              private unitService: UnitService,
              private t: TranslatePipe) {}

  ngOnInit(): void {
    this.isActive = +this.route.snapshot.params.id === this.unit.id;

    this.sub.add(this.route.params.subscribe(params => {
      this.isActive = +params.id === this.unit.id;
    }));
  }

  unitClicked(): void {
    if (this.unit.disabled) {
      return;
    }

    this.router.navigate(['/platform', 'units', this.unit.id]);
  }

  dragStart(event) {
    event.dataTransfer.setData('transferredUnit', JSON.stringify(this.unit));
  }

  drop(event): void {
    console.log(event)

    event.stopPropagation();
    event.preventDefault();

    const transferredUnit = JSON.parse(event.dataTransfer.getData('transferredUnit'));
    if (transferredUnit.id === this.unit.id) {
      return;
    }

    const existingUnit = this.unit.units && this.unit.units.find(unit => unit.id === transferredUnit.id);
    if (existingUnit) {
      return;
    }

    const msg = this.t.transform('transfer_v') + ' ' + transferredUnit.name + ' ' + this.t.transform('to') + ' ' + this.unit.name + '?';

    this.notifications.warning(msg).then(confirmation => {
      if (confirmation.value) {
        this.unitService.transferUnit(transferredUnit.id, this.unit.id).then(response => {
          if (response) {
            this.unitService.getUnits().then(units => {
              this.loadedUnits.emit(units);
            });
          }
        });
      }
    });
  }

  allowDrop(event) {
    event.preventDefault();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
