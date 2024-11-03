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

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';
import { dataTableAnimations } from './classes/data-table-animations';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.sass'],
  animations: dataTableAnimations
})
export class DataTableComponent implements OnInit, OnDestroy {

  @HostBinding('class') class = 'data-table';

  @Input() tableUrl: string;
  @Input() hasSearch = true;
  @Input() columns: DataTableColumn[] = [];
  @Input() formUrl: string;
  @Input() activeSwitch: string;
  @Input() hasCheckColumn = true;
  @Input() disableCheckAll = false;
  @Input() hasActionsHeader = true;
  @Input() limit = 30;
  @Input() isSelectable = false;

  @Output() fetchItems = new EventEmitter<boolean>();
  @Output() openMultipleEdit = new EventEmitter<boolean>();

  items: any[] = [];
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
    this.handleSavedSearch();
    
    this.columnLength = this.columns.length + +this.hasCheckColumn + +this.hasActionsHeader;
    
    this.sub.add(this.route.queryParams.subscribe(() => this.init()));
  }

  private init(): void {
    this.criteria.page = (this.route.snapshot.queryParams.page) ? +this.route.snapshot.queryParams.page : 1;
    this.paginationData.currentPage = this.criteria.page;
    this.loadItems();
  }

  private handleSavedSearch() {
    const isRoutedFromForm = this.appState.previousUrl.includes(this.tableUrl + '/form');
    if (!isRoutedFromForm) {
      sessionStorage.removeItem(this.tableUrl + '_criteria');
    }

    if (isRoutedFromForm && sessionStorage.getItem(this.tableUrl + '_criteria')) {
      this.criteria = JSON.parse(sessionStorage.getItem(this.tableUrl + '_criteria'));
    }
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
    this.paginationData.lastPage = response && response.lastPage ? response.lastPage : 0;
    this.items = response && response.items ? response.items : [];
    
    if (response.columnLength) {
      this.columnLength = response.columnLength;
    }
  }

  search(keyword: string, event?: KeyboardEvent): void {
    if (((event && (event.code === 'Enter' || event.code === 'NumpadEnter')) || !event) && !this.isLoading) {
      this.criteria.keyword = keyword;
      this.loadItems();


      sessionStorage.setItem(this.tableUrl + '_criteria', JSON.stringify(this.criteria));
    }
  }

  resetSearch(searchInput: NgModel): void {
    searchInput.reset();
    if (this.criteria.keyword) {
      this.criteria.keyword = '';
      this.loadItems();
    }

    sessionStorage.setItem(this.tableUrl + '_criteria', JSON.stringify(this.criteria));
  }

  criteriaChange() {
    sessionStorage.setItem(this.tableUrl + '_criteria', JSON.stringify(this.criteria));

    this.loadItems();
  }

  sort(column: DataTableColumn , dir: 'asc' | 'desc'): void {
    this.criteria.sort.column = column.name;
    this.criteria.sort.direction = dir;

    sessionStorage.setItem(this.tableUrl + '_criteria', JSON.stringify(this.criteria));

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

    sessionStorage.setItem(this.tableUrl + '_criteria', JSON.stringify(this.criteria));
  }

  checkItem(item: any, isChecked: boolean): void {
    item.checked = isChecked;
    if (item.checked) {
      this.criteria.checkedItems.push(item);
    } else {
      this.criteria.isCheckAll = false;
      this.removeFromCheckedItemsList(item);
    }

    sessionStorage.setItem(this.tableUrl + '_criteria', JSON.stringify(this.criteria));
  }

  private removeFromCheckedItemsList(item: any): void {
    this.criteria.checkedItems.some((checkedItem, index) => {
      if (checkedItem._id === item._id) {
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
