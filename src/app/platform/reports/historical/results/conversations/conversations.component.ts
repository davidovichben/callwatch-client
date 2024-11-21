import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgClass, NgForOf } from '@angular/common';

import { TranslateModule } from '../../../../../_shared/pipes/translate/translate.module';

import { SlideDown } from '../../../../../_shared/constants/animations';

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [
    NgForOf,
    TranslateModule,
    NgClass
  ],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.sass',
  animations: [SlideDown]
})
export class ConversationsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, conversations: any[] }) {}
  
  
  stripHtml(html: string) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || null;
  }
}
