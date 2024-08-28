import { Component, Input, OnDestroy, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';
import { UnitStateService } from 'src/app/_shared/services/state/unit-state.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { UnitModel } from 'src/app/_shared/models/unit.model';

@Component({
  selector: 'app-unit-tree',
  templateUrl: './unit-tree.component.html',
  styleUrls: ['./unit-tree.component.sass']
})
export class UnitTreeComponent implements OnInit, OnDestroy {

  @ViewChild('dragPlaceholder') dragPlaceholder: ElementRef;

  @Input() rootUnit: UnitModel;
  @Input() loadingUnits: boolean;
  @Input() activeUnit;

  @Output() loadedUnits = new EventEmitter();

  readonly sub = new Subscription();
  
  constructor(private router: Router, private notifications: NotificationService,
              private unitService: UnitService, private unitStateService: UnitStateService,
              private t: TranslatePipe) {}

  ngOnInit(): void {
    this.sub.add(this.unitStateService.unitLoaded.subscribe(unit => {
      this.setActiveUnit(unit);
    }));

    this.sub.add(this.unitStateService.unitTransferred.subscribe(unit => {
      this.setActiveUnit(unit);
    }));

    this.sub.add(this.unitStateService.unitNameChanged.subscribe(changedUnit => {
      let units = this.rootUnit.units;

      changedUnit.ancestors.forEach(ancestor => {
        if (!units) {
          return;
        }

        const unit = units.find(unit => unit._id === ancestor._id);
        if (unit) {
          units = unit.units;

          if (unit._id === changedUnit._id) {
            unit.name = changedUnit.name;
          }
        }
      });
    }));

    this.setActiveBranch();
  }

  async toggleUnit(unit: UnitModel): Promise<void> {
    if (unit.units || unit.toggled) {
      unit.toggled = !unit.toggled;
      return;
    }

    unit.units = await this.unitService.getUnits(unit._id);
    unit.toggled = true;
  }

  private setActiveUnit(unit?: UnitModel): void {
    if (!unit) {
      return;
    }

    this.activeUnit = unit;

    this.setActiveBranch();
  }

  private setActiveBranch(): void {
    if (!this.activeUnit.ancestors) {
      return;
    }

    let branchUnit = null;
    this.activeUnit.ancestors.forEach(ancestor => {
      branchUnit = this.toggleActiveBranch(ancestor.id, branchUnit);
    });
  }

  private toggleActiveBranch(ancestorId: string, branchUnit?: UnitModel): UnitModel {
    const units = branchUnit ? branchUnit.units : this.rootUnit.units;
    const unit = units.find(unit => unit._id === ancestorId);
    if (unit) {
      unit.toggled = true;
      return unit;
    }

    return null;
  }

  unitClicked(unit: UnitModel): void {
    if (unit.disabled) {
      return;
    }

    this.router.navigate(['/platform', 'units', unit._id]);
  }

  dragStart(event: DragEvent, unit: UnitModel): void {
    const ele = this.dragPlaceholder.nativeElement.cloneNode();
    ele.style.backgroundColor = '#fff';
    ele.style.width = '200px';
    ele.style.padding = '8px';
    ele.style.position = 'absolute';
    ele.style.top = 0;
    ele.style.right = '50px';
    ele.style.zIndex = 99999;

    ele.append(unit.name);

    document.body.appendChild(ele);

    event.dataTransfer.setDragImage(ele, 100, 25);
    event.dataTransfer.setData('transferredUnit', JSON.stringify(unit));
  }

  async drop(event: DragEvent, destinationUnit: UnitModel): Promise<void> {
    event.stopPropagation();
    event.preventDefault();

    if (!event.dataTransfer.getData('transferredUnit')) {
      return;
    }

    const transferredUnit = JSON.parse(event.dataTransfer.getData('transferredUnit'));
    if (transferredUnit.id === destinationUnit._id) {
      return;
    }

    const existingUnit = destinationUnit.units && destinationUnit.units.find(unit => unit._id === transferredUnit.id);
    if (existingUnit) {
      return;
    }

    const msg = this.t.transform('transfer_v') + ' ' + transferredUnit.name + ' ' + this.t.transform('to') + ' ' + destinationUnit.name + '?';

    const confirmation = await this.notifications.warning(msg);
    if (confirmation.value) {
      const response = await this.unitService.transferUnit(transferredUnit.id, destinationUnit._id);
        if (response) {
          if (response.error) {
            if (response.error.errorCode === 1) {
              const msg = this.t.transform('unit_transfer_child_error');
              this.notifications.error(msg);
            }
          } else {
            this.rootUnit.units = await this.unitService.getUnits();
            this.unitStateService.unitTransferred.next(response.resource);
          }
        }
    }
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
