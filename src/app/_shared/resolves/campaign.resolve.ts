import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { CampaignService } from 'src/app/_shared/services/http/campaign.service';

import { CampaignModel } from 'src/app/_shared/models/campaign.model';

@Injectable()
export class CampaignResolve implements Resolve<CampaignModel> {

  constructor(private campaignService: CampaignService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    const campaignId = +snapshot.params.id;
    return this.campaignService.getCampaign(campaignId).then(response => response as CampaignModel);
  }
}
