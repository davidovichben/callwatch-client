import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { CompanyService } from 'src/app/_shared/services/http/company.service';
import { CompanySelectService } from 'src/app/_shared/services/state/company-select.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class CompanySelectResolve implements Resolve<SelectItemModel[]> {

  constructor(private companyService: CompanyService, private companySelect: CompanySelectService) {}

  resolve() {
    return this.companyService.selectCompanies().then(response => {
      this.companySelect.setCompanies(response);
      return response as SelectItemModel[];
    });
  }
}
