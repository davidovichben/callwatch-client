import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { OrganizationService } from 'src/app/_shared/services/http/organization.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { OrganizationModel } from 'src/app/_shared/models/organization.model';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html'
})
export class OrganizationsComponent {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'organization_name', name: 'name' },
    { label: 'status', name: 'isActive' }
  ];

  constructor(private router: Router, private organizationService: OrganizationService,
              private userSession: UserSessionService) {}

  fetchItems(): void {
    const criteria = this.dataTable.criteria;

    this.organizationService.getOrganizations(criteria).then(response => {
      this.dataTable.setItems(response);
    });
  }

  enterOrganization(organization: OrganizationModel): void {
    this.organizationService.enterOrganization(organization.id).then(response => {
      if (response) {
        this.userSession.setOrganization(organization.name)
        this.router.navigate(['/platform']);
      }
    });
  }
}
