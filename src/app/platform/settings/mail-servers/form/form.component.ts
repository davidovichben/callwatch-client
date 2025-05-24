import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MailServerService } from 'src/app/_shared/services/http/mail-server.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
  styles: [`.margin-fix { margin-top: -25px }`]
})
export class FormComponent implements OnInit {
  // Constants
	readonly errorMessages = ErrorMessages;
  
  // Data properties
  mailServerId: string | null = null;
  mailbox: any = null;

  // Form properties
  formGroup: FormGroup;
  isSubmitting = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private mailServerService: MailServerService,
    private notifications: NotificationService
  ) {}

	ngOnInit(): void {
	    // Load data from route resolvers
	    this.loadComponentData();
	    
	    // Initialize form
	    this.initForm();
	    
	    // Populate form if editing
	    if (this.mailServerId && this.route.snapshot.data.mailServer) {
	      this.formGroup.patchValue(this.route.snapshot.data.mailServer);
	    }
	  }
	  
	  /**
	   * Load data from route resolvers
	   */
	  private loadComponentData(): void {
	    const routeData = this.route.snapshot.data;
	    
	    // Load mail server if editing
	    if (routeData.mailServer) {
	      this.mailServerId = routeData.mailServer._id;
	      this.mailbox = routeData.mailServer;
	    }
  }

  /**
   * Initialize form with controls and validators
   */
  private initForm(): void {
    this.formGroup = this.fb.group({
      domain: ['', { validators: Validators.required, nonNullable: true }],
      tenantID: ['', { validators: Validators.required, nonNullable: true }],
      clientID: ['', { validators: Validators.required, nonNullable: true }],
      clientSecret: ['', { validators: Validators.required, nonNullable: true }]
    });
  }
  
	  /**
	   * Submit the form
	   */
	async submit(): Promise<void> {
	    // Validate form and prevent multiple submissions
		if (!this.formGroup.valid || this.isSubmitting) {
	      return;
	    }
	    
	    this.isSubmitting = true;
	
	    try {
	      let response: boolean;
	      const formValues = this.formGroup.getRawValue();
	      
	      if (this.mailServerId) {
	        // Update existing mail server
	        response = await this.mailServerService.updateMailServer(this.mailServerId, formValues);
	      } else {
	        // Create new mail server
	        response = await this.mailServerService.createMailServer(formValues);
	      }
	      
	      this.handleServerResponse(response);
	    } catch (error) {
	      // Handle errors
	      this.isSubmitting = false;
	      this.notifications.error('error_saving_mail_server');
	      console.error('Error saving mail server:', error);
	    }
	}
	
	  /**
	   * Handle response from server after create/update operations
	   */
	private handleServerResponse(response: boolean): void {
		if (response) {
	      // Show success notification
	      this.notifications.success();
	      // Navigate back to mail servers list
			this.router.navigate(['/platform', 'settings', 'mailServers']);
	    } else {
	      // Reset submission state if operation failed
	      this.isSubmitting = false;
	    }
	}
}
