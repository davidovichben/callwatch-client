import { Component, Input, OnDestroy, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { TranslateModule } from '../../../pipes/translate/translate.module';

import { AppStateService } from 'src/app/_shared/services/state/app-state.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass'],
  imports: [CommonModule, TranslateModule, RouterOutlet],
  standalone: true
})
export class ContentComponent implements OnInit, OnDestroy {

  @Input() @HostBinding('class') sidebarToggleState = 'opened';

  readonly sub = new Subscription();

  noPadding = false;
  
  constructor(private route: ActivatedRoute,
              private appState: AppStateService) {}

  ngOnInit(): void {
    this.setPadding();

    this.sub.add(this.appState.urlChanged.subscribe(() => this.setPadding()));
  }

  private setPadding(): void {
    this.noPadding = false;

    let component = this.route.firstChild;
    while (component?.firstChild) {
      component = component.firstChild;
      if (component.snapshot.data.noPadding) {
        this.noPadding = true;
      }
    }
  }
  
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
