import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { UnitModel } from 'src/app/_shared/models/unit.model';

@Component({
  selector: 'app-unit-tree',
  templateUrl: './unit-tree.component.html',
  styleUrls: ['./unit-tree.component.styl']
})
export class UnitTreeComponent implements OnInit, OnDestroy {

  @Input() rootUnit: UnitModel;

  @Output() loadedUnits = new EventEmitter();

  readonly sub = new Subscription();

  activeUnitId: number | string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private notifications: NotificationService,
              private unitService: UnitService,
              private t: TranslatePipe) {}

  ngOnInit(): void {
    this.activeUnitId = this.route.snapshot.params.id;

    this.sub.add(this.route.params.subscribe(params => {
      this.activeUnitId = this.route.snapshot.params.id;
    }));
  }

  unitClicked(unit: UnitModel): void {
    if (unit.disabled) {
      return;
    }

    this.router.navigate(['/platform', 'units', unit.id]);
  }

  dragStart(event: DragEvent, unit: UnitModel): void {
    event.dataTransfer.setData('transferredUnit', JSON.stringify(unit));
  }

  drop(event: DragEvent, destinationUnit: UnitModel): void {
    event.stopPropagation();
    event.preventDefault();

    const transferredUnit = JSON.parse(event.dataTransfer.getData('transferredUnit'));
    if (transferredUnit.id === destinationUnit.id) {
      return;
    }

    const existingUnit = destinationUnit.units && destinationUnit.units.find(unit => unit.id === transferredUnit.id);
    if (existingUnit) {
      return;
    }

    const msg = this.t.transform('transfer_v') + ' ' + transferredUnit.name + ' ' + this.t.transform('to') + ' ' + destinationUnit.name + '?';

    this.notifications.warning(msg).then(confirmation => {
      if (confirmation.value) {
        this.unitService.transferUnit(transferredUnit.id, destinationUnit.id).then(response => {
          if (response) {
            this.unitService.getUnits().then(units => {
              this.rootUnit.units = units;
            });
          }
        });
      }
    });
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
