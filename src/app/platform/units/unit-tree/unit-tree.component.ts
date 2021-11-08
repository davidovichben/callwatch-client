import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';
import { UnitStateService } from 'src/app/_shared/services/state/unit-state.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { UnitModel } from 'src/app/_shared/models/unit.model';

@Component({
  selector: 'app-unit-tree',
  templateUrl: './unit-tree.component.html',
  styleUrls: ['./unit-tree.component.styl']
})
export class UnitTreeComponent implements OnInit, OnDestroy {

  @Input() rootUnit: UnitModel;
  @Input() loadingUnits: boolean;

  @Output() loadedUnits = new EventEmitter();

  readonly sub = new Subscription();

  activeUnitId: number | string;

  activeUnit: UnitModel;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private notifications: NotificationService,
              private unitService: UnitService,
              private unitStateService: UnitStateService,
              private t: TranslatePipe) {}

  ngOnInit(): void {
    this.sub.add(this.route.params.subscribe(params => {
      this.activeUnitId = params.id;
    }));

    this.sub.add(this.unitStateService.unitNameChanged.subscribe(changedUnit => {
      let units = this.rootUnit.units;

      changedUnit.ancestors.forEach(ancestor => {
        if (!units) {
          return;
        }

        const unit = units.find(unit => unit.id === ancestor.id);
        if (unit) {
          units = unit.units;

          if (unit.id === changedUnit.id) {
            unit.name = changedUnit.name;
          }
        }
      });
    }));
  }

  toggleUnit(unit: UnitModel): void {
    if (unit.units || unit.toggled) {
      unit.toggled = !unit.toggled;
      return;
    }

    this.unitService.getUnits(unit.id).then(response => {
      unit.units = response;
      unit.toggled = true;
    });
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
