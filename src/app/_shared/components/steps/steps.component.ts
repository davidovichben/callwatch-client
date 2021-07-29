import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.styl']
})
export class StepsComponent {
  @Input() steps: string[] = [];
  @Input() keys: object;
}
