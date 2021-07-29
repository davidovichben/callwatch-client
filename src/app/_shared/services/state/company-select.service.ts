import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class CompanySelectService {
  private companies: SelectItemModel[];

  private selectedCompany: SelectItemModel;

  companyChange: Subject<SelectItemModel[]> = new Subject();

  setCompany(companyId: number): void {
    this.selectedCompany = this.companies.find(company => company.id === companyId);

    sessionStorage.setItem('selectedCompany', JSON.stringify(this.selectedCompany));
    this.companyChange.next(this.companies);
  }

  setCompanies(companies: SelectItemModel[]): void {
    this.companies = companies;
    this.companyChange.next(this.companies);
  }

  getCompanies(withoutActiveCompany?: boolean): SelectItemModel[] {
    if (withoutActiveCompany) {
      return this.companies.filter(company => company.id !== this.getSelectedCompanyId());
    }

    return this.companies;
  }

  getSelectedCompany(): SelectItemModel {
    const selectedCompany = sessionStorage.getItem('selectedCompany');
    return selectedCompany ? JSON.parse(selectedCompany) : this.companies[0];
  }

  getSelectedCompanyId(): number {
    const selectedCompany = this.getSelectedCompany();
    return selectedCompany ? selectedCompany.id : null;
  }

  clearCompanies(): void {
    this.companies = [];
    this.selectedCompany = null;
    sessionStorage.removeItem('selectedCompany');
  }
}
