import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { KeywordService } from '../../../../_shared/services/http/keyword.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

	readonly errorMessages = ErrorMessages;
	
	keywordId: string;

  formGroup: UntypedFormGroup;
  
  isSubmitting = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private fb: UntypedFormBuilder, private keywordService: KeywordService) {}

	ngOnInit(): void {
    this.setForm();
    
    const routeData = this.route.snapshot.data;
    
    if (routeData.keyword) {
      this.keywordId = routeData.keyword.id;
      this.formGroup.patchValue(routeData.keyword);
    }
  }

  private setForm(): void {
    this.formGroup = this.fb.group({
      name: this.fb.control(null, Validators.required)
    });
  }
  
	async submit(): Promise<void> {
		if (!this.formGroup.valid || this.isSubmitting) {
      return;
    }
    
    this.isSubmitting = true;

    let response: boolean;
    
    if (this.keywordId) {
      response = await this.keywordService.updateKeyword(this.keywordId, this.formGroup.getRawValue());
    } else {
      response = await this.keywordService.createKeyword(this.formGroup.getRawValue());
    }
    
    this.handleServerResponse(response);
    
    this.isSubmitting = false;
	}

	private handleServerResponse(response: boolean): void {
		if (response) {
			this.router.navigate(['/platform', 'settings', 'keywords']);
    } else {
      this.isSubmitting = false;
    }
	}
}
