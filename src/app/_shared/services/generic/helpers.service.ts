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
}
