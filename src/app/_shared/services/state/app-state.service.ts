import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AppStateService {
  urlChanged: Subject<string> = new Subject();
  pageSpinnerShown: Subject<boolean> = new Subject();

  routeScrollDisabled = false;
  previousUrl: string;

  setPageSpinner(isShown: boolean): void {
    setTimeout(() => this.pageSpinnerShown.next(isShown), 0);
  }
}
