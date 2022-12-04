import { Component, Input, Output, OnDestroy, OnInit, EventEmitter, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { AppStateService } from 'src/app/_shared/services/state/app-state.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { PaginationData } from './classes/pagination-data';
import { DataTableCriteria } from './classes/data-table-criteria';
import { DataTableResponse } from './classes/data-table-response';
import { DataTableColumn } from './classes/data-table-column';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: '0',
      })),
      state('active', style({
        display: '*',
        opacity: '1',
      })),
      transition('active => inactive', animate('200ms')),
      transition('inactive => active', animate('200ms'))
    ]),
    trigger('slideToggle', [
      state('inactive', style({
        pointerEvents: 'none',
        height: '0',
        opacity: '0'
      })),
      state('active', style({
        pointerEvents: 'all',
        height: '*',
        opacity: '1'
      })),
      transition('active => inactive', animate('400ms ease-in')),
      transition('inactive => active', animate('400ms ease-in'))
    ])
  ]
})
export class DataTableComponent implements OnInit, OnDestroy {

  @HostBinding('class') class = 'data-table';

  @Input() columns: DataTableColumn[] = [];
  @Input() formUrl: string;
  @Input() activeSwitch: string;
  @Input() hasCheckColumn = true;
  @Input() disableCheckAll = false;
  @Input() hasActionsHeader = true;
  @Input() hasExtendedSearch = true;
  @Input() limit = 30;
  @Input() isSelectable = false;

  @Output() fetchItems = new EventEmitter<boolean>();
  @Output() openMultipleEdit = new EventEmitter<boolean>();

  items: {}[] = [];
  sub = new Subscription();
  criteria = new DataTableCriteria();
  paginationData = new PaginationData(this.limit);
  isLoading: boolean;
  isActive = true;
  savedItem: string;
  columnLength = 0;

  constructor(protected router: Router, protected route: ActivatedRoute,
              protected appState: AppStateService,
              protected notifications: NotificationService,
              protected t: TranslatePipe,
              protected dialog: MatDialog) {}

  ngOnInit() {
    this.checkSavedItem('saved-item');

    this.columnLength = this.columns.length + +this.hasCheckColumn + +this.hasActionsHeader;

    this.sub.add(this.route.queryParams.subscribe(() => this.init()));
  }

  private init(): void {
    this.criteria.page = (this.route.snapshot.queryParams.page) ? +this.route.snapshot.queryParams.page : 1;
    this.paginationData.currentPage = this.criteria.page;
    this.loadItems();
  }

  loadItems(): void {
    this.appState.setPageSpinner(true);
    this.isLoading = true;
    this.fetchItems.emit(this.isActive);
  }

  setItems(response: DataTableResponse): void {
    this.appState.setPageSpinner(false);
    this.isLoading = false;

    this.paginationData.totalItems = response && response.total ? response.total : 0;
    this.paginationData.totalPages = response && response.lastPage ? response.lastPage : 0;
    this.items = response && response.items ? response.items : [];

    // this.items.map((item: { id: number, checked: boolean }) => {
    //   item.checked = this.criteria.isCheckAll;
    //   this.criteria.checkedItems.forEach(checkedItem => {
    //     if (checkedItem.id === item.id) {
    //       item.checked = !this.criteria.isCheckAll;
    //     }
    //   });
    // });
  }

  checkSavedItem(key: string): void {
    if (sessionStorage.getItem(key)) {
      this.savedItem = sessionStorage.getItem(key);
      sessionStorage.removeItem(key);
    }
  }

  search(keyword: string, event?: KeyboardEvent): void {
    if (((event && (event.code === 'Enter' || event.code === 'NumpadEnter')) || !event) && !this.isLoading) {
      this.criteria.keyword = keyword;
      this.loadItems();
    }
  }

  resetSearch(searchInput: NgModel): void {
    searchInput.reset();
    if (this.criteria.keyword) {
      this.criteria.keyword = '';
      this.loadItems();
    }
  }

  // extendedSearch(values: object): void {
  //   this.criteria.filters = values;
  //
  //   if (this.criteria.page  > 1) {
  //     this.criteria.page = 1;
  //     this.paginationData.currentPage = this.criteria.page;
  //
  //     const url: string = this.router.url.substring(0, this.router.url.indexOf('?'));
  //     this.router.navigateByUrl(url);
  //   } else {
  //     this.search();
  //   }
  // }

  sort(column: DataTableColumn , dir: 'asc' | 'desc'): void {
    this.criteria.sort.column = column.name;
    this.criteria.sort.direction = dir;
    this.loadItems();
  }

  checkAll(isChecked: boolean): void {
    this.criteria.isCheckAll = isChecked;

    this.criteria.checkedItems = [];

    this.items.forEach((item: any) => {
      item.checked = isChecked;
      if (isChecked) {
        this.criteria.checkedItems.push(item);
      }
    });
  }

  checkItem(item: any, isChecked: boolean): void {
    item.checked = isChecked;
    if (item.checked) {
      this.criteria.checkedItems.push(item);
    } else {
      this.criteria.isCheckAll = false;
      this.removeFromCheckedItemsList(item);
    }
  }

  private removeFromCheckedItemsList(item: any): void {
    this.criteria.checkedItems.some((checkedItem, index) => {
      if (checkedItem.id === item.id) {
        this.criteria.checkedItems.splice(+index, 1);
        return true;
      }

      return false;
    });
  }

  toggleActiveStatus(isActive: boolean): void {
    this.isActive = isActive;
    this.criteria.checkedItems = [];
    this.criteria.isCheckAll = false;
    this.loadItems();
  }

  openMultipleEditDialog(dialogComponent, data): void {
    const checkedItems = this.criteria.checkedItems;

    if (checkedItems.length === 0) {
      this.notifications.error(this.t.transform('no_items_selected'));
      return;
    }

    const dialog = this.dialog.open(dialogComponent, {
      data: { checkedItems, ...data },
      width: '600px'
    })

    const sub = dialog.afterClosed().subscribe(updated => {
      if (updated) {
        this.fetchItems.emit(this.isActive);
        this.notifications.success()
      }

      this.criteria.checkedItems = [];
      this.checkAll(false);
    });

    this.sub.add(sub);
  }

  get hasItems(): boolean {
    return this.items.length > 0;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
