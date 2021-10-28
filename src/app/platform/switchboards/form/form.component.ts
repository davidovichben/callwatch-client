import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SwitchboardService } from 'src/app/_shared/services/http/switchboard.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { SwitchboardTypes } from 'src/app/_shared/models/switchboard.model';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

	readonly errorMessages = ErrorMessages;

  readonly types = Object.keys(SwitchboardTypes).map(type => {
    return { value: type, label: SwitchboardTypes[type] };
  });

  switchboardId: number;

	isSubmitting = false;

  switchboardForm: FormGroup;

	constructor(private router: Router, private route: ActivatedRoute,
        private fb: FormBuilder, private switchboardService: SwitchboardService) {}

	ngOnInit(): void {
    this.switchboardForm = this.fb.group({
      name: this.fb.control(null, Validators.required),
      type: this.fb.control(null, Validators.required),
      netAddress: this.fb.control(null),
    });

    const routeData = this.route.snapshot.data;
    if (routeData.switchboard) {
      this.switchboardId = routeData.switchboard.id;
      this.switchboardForm.patchValue(routeData.switchboard);
    }
  }

	submit(): void {
		if (this.switchboardForm.valid) {
			this.isSubmitting = true;

			if (this.switchboardId) {
				this.switchboardService.updateSwitchboard(this.switchboardId, this.switchboardForm.value).then(response => {
          this.handleServerResponse(response)
        });
			} else {
				this.switchboardService.newSwitchboard(this.switchboardForm.value).then(response => {
          this.handleServerResponse(response)
        });
			}
		}
	}

	private handleServerResponse(response: boolean): void {
		if (response) {
			this.router.navigate(['/platform', 'switchboards']);
		}

		this.isSubmitting = false;
	}
}
