import { Component, Input, OnDestroy, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('dragPlaceholder') dragPlaceholder: ElementRef;

  @Input() rootUnit: UnitModel;
  @Input() loadingUnits: boolean;
  @Input() activeUnit;

  @Output() loadedUnits = new EventEmitter();

  readonly sub = new Subscription();


  constructor(private route: ActivatedRoute, private router: Router,
              private notifications: NotificationService, private unitService: UnitService,
              private unitStateService: UnitStateService, private t: TranslatePipe) {}

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

        const unit = units.find(unit => unit.id === ancestor.id);
        if (unit) {
          units = unit.units;

          if (unit.id === changedUnit.id) {
            unit.name = changedUnit.name;
          }
        }
      });
    }));

    this.setActiveBranch();
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

  private toggleActiveBranch(ancestorId: number, branchUnit?: UnitModel): UnitModel {
    const units = branchUnit ? branchUnit.units : this.rootUnit.units;
    const unit = units.find(unit => unit.id === ancestorId);
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

    this.router.navigate(['/platform', 'units', unit.id]);
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

  drop(event: DragEvent, destinationUnit: UnitModel): void {
    event.stopPropagation();
    event.preventDefault();

    if (!event.dataTransfer.getData('transferredUnit')) {
      return;
    }

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
            if (response.error) {
              if (response.error.errorCode === 1) {
                const msg = this.t.transform('unit_transfer_child_error');
                this.notifications.error(msg);
              }
            } else {
              this.unitService.getUnits().then(units => {
                this.rootUnit.units = units;
                this.unitStateService.unitTransferred.next(response.resource);
              });
            }
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
