import { browser } from '$app/environment';
import type { Theme } from './types';

//export const url = 'wss://collie-known-wildly.ngrok-free.app';

export const colorNames: Theme = {
	bg: 'Background',
	'light-bg': 'Light background',
	fg: 'Inputs',
	text: 'Text',
	'light-text': 'Artist and date',
	'sender-text': '"Sent by"-text',
	checked: 'Checkbox checked',
	'save-bg': 'Save button',

	'icon-message': 'Icon message',
	'icon-new': 'Icon new',
	'icon-reaction': 'Icon new reaction',
	'icon-favorite': 'Icon current favorite',
	confirm: 'Confirm'
};

export const colors = Object.keys(colorNames).map((x) => x as keyof Theme);

export const themes: Record<string, Theme> = {
	default: {
		bg: '#000000',
		fg: '#3a3a3a',
		'light-bg': '#2f2f2f',
		text: '#ffffff',
		'light-text': '#828282',
		'sender-text': '#60a5fa',
		checked: '#404040',
		'save-bg': '#15803d',

		'icon-message': '#ffffff',
		'icon-new': '#00ff00',
		'icon-reaction': '#a600ff',
		'icon-favorite': '#fcdb03',
		confirm: '#209045'
	}
	/*midnight: {
		bg: '#000520',
		fg: '#0a1630',
		'light-bg': '#06102a',
		text: '#ffffff',
		'light-text': '#828282',
		'sender-text': '#60a5fa',
		checked: '#1a2a45',
		'save-bg': '#15803d',

		'icon-message': '#ffffff',
		'icon-new': '#00ff00',
		'icon-reaction': '#a600ff',
		'icon-favorite': '#fcdb03'
	},
	clouds: {
		bg: '#ffffff',
		'light-bg': '#c9e8f8',
		fg: '#add8e6',
		text: '#000000',
		'light-text': '#787878',
		'sender-text': '#107dd1',
		checked: '#82b1ba',
		'save-bg': '#1cba36',
		'icon-message': '#000000',
		'icon-new': '#59c559',
		'icon-reaction': '#a600ff',
		'icon-favorite': '#fdff8f'
	},
	lavender: {
		bg: '#22013c',
		'light-bg': '#2e024b',
		fg: '#3c0658',
		text: '#ffffff',
		'light-text': '#787878',
		'sender-text': '#4b82af',
		checked: '#4f157f',
		'save-bg': '#1cba36',
		'icon-message': '#ffffff',
		'icon-new': '#00ff00',
		'icon-reaction': '#a600ff',
		'icon-favorite': '#fcdb03'
	},
	wine: {
		bg: '#380000',
		'light-bg': '#5d0404',
		fg: '#841010',
		text: '#ffffff',
		'light-text': '#969696',
		'sender-text': '#0fc26f',
		checked: '#940000',
		'save-bg': '#15803d',
		'icon-message': '#ffffff',
		'icon-new': '#00ff00',
		'icon-reaction': '#a600ff',
		'icon-favorite': '#fcdb03'
	},
	forest: {
		bg: '#0d2c02',
		'light-bg': '#073b10',
		fg: '#025a08',
		text: '#ffffff',
		'light-text': '#969696',
		'sender-text': '#ce9546',
		checked: '#075f19',
		'save-bg': '#30a4df',
		'icon-message': '#ffffff',
		'icon-new': '#00ff00',
		'icon-reaction': '#a600ff',
		'icon-favorite': '#fcdb03'
	}*/
};
