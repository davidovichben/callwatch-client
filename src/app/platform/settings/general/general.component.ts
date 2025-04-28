import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { OrganizationService } from 'src/app/_shared/services/http/organization.service';
import { ErrorMessages } from '../../../_shared/constants/error-messages';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html'
})
export class GeneralComponent implements OnInit {
  readonly errorMessages = ErrorMessages;

  formGroup: FormGroup;
  isSubmitting = false;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private notification: NotificationService,
    private organizationService: OrganizationService,
    public userSession: UserSessionService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const settings = this.route.snapshot.data.settings || {};
    
    this.formGroup = this.fb.group({
      minimalReplyTime: [settings.minimalReplyTime],
    });
  }
  
  async submit(): Promise<void> {
    if (this.formGroup.invalid || this.isSubmitting) {
      return;
    }
    
    const success = await this.organizationService.updateSettings(this.formGroup.value);
    if (success) {
      this.notification.success();
    } else {
      this.notification.serverError();
    }
    
    this.isSubmitting = false;
  }
}
