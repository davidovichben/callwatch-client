import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.sass']
})
export class WidgetComponent implements OnInit {

  @Input() type: string;
  @Input() width: number;
  @Input() height: number;

  constructor() { }

  ngOnInit(): void {
  }

}
