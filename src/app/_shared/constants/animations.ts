import { animate, state, style, transition, trigger } from '@angular/animations';

export const Fade = trigger('fade', [
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

export const SlideDown = trigger('slideDown', [
  state('inactive', style({
    height: '0',
    opacity: '0',
  })),
  state('active', style({
    height: '*',
    opacity: '1',
  })),
  transition('inactive => active', animate('300ms ease-in')),
  transition('active => inactive', animate('300ms ease-out'))
]);

export const placeholder = trigger('placeholder', [
  state('inactive', style({
    top: '*',
    lineHeight: '*',
    padding: '0',
    fontSize: '*'
  })),
  state('active', style({
    top: '-1px',
    lineHeight: '0.6',
    padding: '0 4px',
    fontSize: '12px'
  })),
  transition('active => inactive', animate('200ms')),
  transition('inactive => active', animate('200ms'))
]);



export const slideToggle = trigger('slideToggle', [
  state('inactive', style({
    display: 'none',
    height: '0',
    opacity: '0'
  })),
  state('active', style({
    display: 'block',
    height: '*',
    opacity: '1'
  })),
  transition('active => inactive', animate('0ms ease-in')),
  transition('inactive => active', animate('0ms ease-out'))
]);


