import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MailboxService } from 'src/app/_shared/services/http/mailbox.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { Fade } from 'src/app/_shared/constants/animations';
import { MailboxModel } from '../../../../_shared/models/mailbox.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  animations: [Fade]
})
export class FormComponent implements OnInit, OnDestroy {

  readonly sub = new Subscription();
  
  readonly errorMessages = ErrorMessages;
  
  formGroup: UntypedFormGroup;
  mailbox: MailboxModel;
  
  isSubmitting = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private fb: UntypedFormBuilder, private mailboxService: MailboxService) {}

  ngOnInit(): void {
    this.makeForm();

    this.mailbox = this.route.snapshot.data.mailbox;

    if (this.mailbox) {
      this.formGroup.patchValue(this.mailbox);
    }
  }

  private makeForm(): void {
    this.formGroup = this.fb.group({
      name: this.fb.control(null, Validators.required),
    })
  }

  
  async submit(): Promise<void> {
    if (this.formGroup.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      let response: boolean;
      
      if (this.mailbox) {
        response = await this.mailboxService.updateMailbox(this.mailbox.id, this.formGroup.value);
      } else {
        response = await this.mailboxService.createMailBox(this.formGroup.value);
      }
      
      this.handleServerResponse(response)
    }
  }
  
  private handleServerResponse(response: boolean): void {
    if (response) {
      this.router.navigate(['/platform', 'settings', 'mailboxes']);
    }
    
    this.isSubmitting = false;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
