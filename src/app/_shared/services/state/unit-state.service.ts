import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class UnitStateService {

  private subject = new Subject<any>();

  changeUnit() {
    this.subject.next();
  }

  getUnits(): Observable<any> {
    return this.subject.asObservable();
  }
}
