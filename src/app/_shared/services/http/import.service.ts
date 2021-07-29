import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from 'src/app/_shared/services/http/base-http.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

@Injectable()
export class ImportService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/excel';

  constructor(private http: HttpClient, private userSessionService: UserSessionService) {
    super(userSessionService);
  }

  uploadFile(file: File, type: string, companyId: number): Promise<boolean> {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('companyId', companyId.toString());
    formData.append('file', file);

    return this.http.post(this.endPoint + '/import', formData)
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  getExampleFile(type: string): Promise<Blob> {
    return this.http.get(this.endPoint + '/example', this.getBlobRequest({ type }))
      .toPromise()
      .then(response => response as Blob)
      .catch(() => null);
  }
}
