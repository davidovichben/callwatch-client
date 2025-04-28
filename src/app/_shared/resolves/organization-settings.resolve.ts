import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { OrganizationService } from 'src/app/_shared/services/http/organization.service';

@Injectable()
export class OrganizationSettingsResolve implements Resolve<any> {
  
  constructor(
    private organizationService: OrganizationService
  ) {}
  
  resolve(): Promise<any> {
    return this.organizationService.getSettings();
  }
}
