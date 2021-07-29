import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { FormComponent } from './form/form.component';

import { OrganizationService } from 'src/app/_shared/services/http/organization.service';

import { OrganizationModel } from 'src/app/_shared/models/organization.model';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html'
})
export class OrganizationsComponent {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'organization_name', name: 'name' },
    { label: 'status', name: 'status' }
  ];

  constructor(private router: Router, private dialog: MatDialog,
              private organizationService: OrganizationService) {}

  fetchItems(): void {
    const criteria = this.dataTable.criteria;

    this.organizationService.getOrganizations(criteria).then(response => {
      this.dataTable.setItems(response);
    });
  }

  openDialog(organization?: OrganizationModel): void {
    this.dialog.open(FormComponent, {
      data: organization
    })
  }

  // deleteOrganization(organization) {
  //   this.axios.delete('organization/' + organization.id).then(response => {
  //     if (response) {
  //       this.fetch();
  //     }
  //   });
  // }

  enterOrganization(organizationId: number): void {
    this.organizationService.enterOrganization(organizationId).then(response => {
      if (response) {
        this.router.navigate(['/platform']);
      }
    });
  }
}
