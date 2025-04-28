import { Component, ViewChild } from '@angular/core';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { KeywordService } from 'src/app/_shared/services/http/keyword.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html'
})
export class KeywordsComponent {
  
  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;
  
  readonly columns = [
    { name: 'name', label: 'name' }
  ];
  
  constructor(private notification: NotificationService,
              public userSession: UserSessionService,
              private keywordService: KeywordService) {}
  
  async fetchItems(): Promise<void> {
    const response = await this.keywordService.getKeywords(this.dataTable.criteria);
    this.dataTable.setItems(response);
  }
  
  async deleteItem(keywordId: string): Promise<void> {
    const confirmation = await this.notification.warning();
    if (confirmation.value) {
      await this.keywordService.deleteKeyword(keywordId);
      this.notification.success();
      await this.fetchItems();
    }
  }
}
