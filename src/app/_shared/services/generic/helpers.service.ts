import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class HelpersService {
  pageSpinnerShown: Subject<boolean> = new Subject();
  urlChanged: Subject<string> = new Subject();

  setPageSpinner(isShown: boolean): void {
    setTimeout(() => this.pageSpinnerShown.next(isShown), 0);
  }

  getEntityType(url: string): string {
    const entityType = url.split('/')[2];
    return entityType.substring(0, entityType.length - 1);
  }

  getBaseUrl(baseUrl: string): string {
    let url = baseUrl.substr(10);
    if (url.indexOf('/') !== -1) {
      url = url.substr(0, url.indexOf('/'));
    }

    return url;
  }
}
