import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ngxtFor]',
})
export class NgxtForDirective {

  private items: any[] = [];
  
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input('ngxtForOf')
  public set ngxtForOf(items: any) {
    this.items = items;
    //Clear any existing items
    this.viewContainer.clear();
  }

  @Input('ngxtForItemsAtOnce')
  public itemsAtOnce: number = 10;

  @Input('ngxtForIntervalLength')
  public intervalLength: number = 50;


}
