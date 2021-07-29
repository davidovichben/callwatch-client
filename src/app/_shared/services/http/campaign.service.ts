import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { CampaignModel } from 'src/app/_shared/models/campaign.model';

import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';

@Injectable()
export class CampaignService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/campaign';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getCampaigns(criteria: DataTableCriteria, companyId: number): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria, { companyId });

    return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getCampaign(campaignId: number): Promise<CampaignModel> {
    return this.http.get(this.endPoint + '/' + campaignId, this.getTokenRequest())
      .toPromise()
      .then(response => response as CampaignModel)
      .catch(() => null);
  }

  newCampaign(values: object, companyId: number, groupIds: number[]): Promise<boolean> {
    return this.http.post(this.endPoint, { ...values, companyId, groupIds }, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  updateCampaign(campaignId: number, values: object, groupIds: any[]): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + campaignId, { ...values, groupIds }, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  sendCampaign(campaignId: number): Promise<boolean> {
    return this.http.post(this.endPoint + '/' + campaignId + '/send', {}, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  getRecipients(criteria: DataTableCriteria, campaignId: number): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);

    return this.http.post(this.endPoint + '/' + campaignId + '/recipient', params, this.getTokenRequest())
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }
}
