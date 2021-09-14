import { NgModule } from '@angular/core';

import { PublicRoutingModule } from './public-routing.module';
import { LocaleSelectModule } from 'src/app/_shared/components/locale-select/locale-select.module';

import { PublicComponent } from './public.component';

@NgModule({
  declarations: [PublicComponent],
	imports: [PublicRoutingModule, LocaleSelectModule]
})
export class PublicModule {}
