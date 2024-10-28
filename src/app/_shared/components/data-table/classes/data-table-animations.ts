import { animate, state, style, transition, trigger } from '@angular/animations';

export const dataTableAnimations = [
	trigger('fade', [
		state('inactive', style({
			display: 'none',
			opacity: '0',
		})),
		state('active', style({
			display: '*',
			opacity: '1',
		})),
		transition('active => inactive', animate('200ms')),
		transition('inactive => active', animate('200ms'))
	]),
	trigger('slideToggle', [
		state('inactive', style({
			pointerEvents: 'none',
			height: '0',
			opacity: '0'
		})),
		state('active', style({
			pointerEvents: 'all',
			height: '*',
			opacity: '1'
		})),
		transition('active => inactive', animate('400ms ease-in')),
		transition('inactive => active', animate('400ms ease-in'))
	])
]
