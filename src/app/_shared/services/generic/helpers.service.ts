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

  base64toFile(base64String: string, filename: string): File {
    let arr = base64String.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  insertAt(arr: any[], index: number, newItem: any): any[] {
    return [
      ...arr.slice(0, index),
      newItem,
      ...arr.slice(index)
    ];
  }



  // Time formatted as hh:mm

  // isTimeBetween(time: string, startTime: string, endTime: string): boolean {
  //   const hours = +time.substr(0, 2);
  //   const startHours = +startTime.substr(0, 2);
  //   const endHours = +endTime.substr(0, 2);
  //   if (hours > startHours && hours < endHours) {
  //     return true;
  //   }
  //
  //   if (hours < startHours || hours > endHours) {
  //     return false;
  //   }
  //
  //   let a = 16 <= hour && hour <= 17
  //   let b = 0 <= minute && minute <= 30
  //
  //   return a && b;
  // }
}
