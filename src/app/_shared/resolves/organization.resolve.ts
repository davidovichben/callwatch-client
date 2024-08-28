import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { OrganizationService } from 'src/app/_shared/services/http/organization.service';

import { OrganizationModel } from 'src/app/_shared/models/organization.model';

@Injectable()
export class OrganizationResolve  {

  constructor(private organizationService: OrganizationService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    const organizationId = snapshot.params.id;
    return this.organizationService.getOrganization(organizationId).then(response => response as OrganizationModel);
  }
}
