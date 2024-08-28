import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MailServerService } from 'src/app/_shared/services/http/mail-server.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
  styles: [`.margin-fix { margin-top: -25px }`]
})
export class FormComponent implements OnInit {

	readonly errorMessages = ErrorMessages;
  
  mailServerId: string;

  formGroup: UntypedFormGroup;
  
  isSubmitting = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private fb: UntypedFormBuilder, private mailServerService: MailServerService) {}

	ngOnInit(): void {
    this.setForm();
    
    const routeData = this.route.snapshot.data;
    
    if (routeData.mailServer) {
      this.mailServerId = routeData.mailServer.id;
      this.formGroup.patchValue(routeData.mailServer);
    }
  }

  private setForm(): void {
    this.formGroup = this.fb.group({
      domain: this.fb.control(null, Validators.required),
      tenantID: this.fb.control(null, Validators.required),
      clientID: this.fb.control(null, Validators.required),
      clientSecret: this.fb.control(null, Validators.required),
    });
  }
  
	async submit(): Promise<void> {
		if (!this.formGroup.valid || this.isSubmitting) {
      return;
    }
    
    this.isSubmitting = true;

    let response: boolean;
    
    if (this.mailServerId) {
      response = await this.mailServerService.updateMailServer(this.mailServerId, this.formGroup.getRawValue());
    } else {
      response = await this.mailServerService.createMailServer(this.formGroup.getRawValue());
    }
    
    this.handleServerResponse(response);
    
    this.isSubmitting = false;
	}

	private handleServerResponse(response: boolean): void {
		if (response) {
			this.router.navigate(['/platform', 'settings', 'mailServers']);
    } else {
      this.isSubmitting = false;
    }
	}
}
