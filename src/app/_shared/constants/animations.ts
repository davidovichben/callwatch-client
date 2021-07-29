import { animate, state, style, transition, trigger } from '@angular/animations';

export const fade = trigger('fade', [
  state('inactive', style({
    display: 'none',
    opacity: '0'
  })),
  state('active', style({
    display: '*',
    opacity: '1'
  })),
  transition('active => inactive', animate('200ms')),
  transition('inactive => active', animate('200ms'))
]);

export const slideDown = trigger('slideDown', [
  state('inactive', style({
    height: '0',
    display: 'none',
    opacity: '0',
  })),
  state('active', style({
    height: '*',
    display: '*',
    opacity: '1',
  })),
  transition('inactive => active', animate('200ms ease-in')),
  transition('active => inactive', animate('200ms ease-out'))
]);
