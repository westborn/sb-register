const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			// https://www.tailwindshades.com/
			colors: {
				primary: {
					DEFAULT: '#085892',
					50: '#5CB5F6',
					100: '#48ACF5',
					200: '#229BF3',
					300: '#0C87DF',
					400: '#0A6FB9',
					500: '#085892',
					600: '#05385D',
					700: '#021828',
					800: '#000000',
					900: '#000000'
				},

				accent: {
					DEFAULT: '#FFCA05',
					50: '#FFF1BD',
					100: '#FFEDA8',
					200: '#FFE47F',
					300: '#FFDB57',
					400: '#FFD32E',
					500: '#FFCA05',
					600: '#CCA100',
					700: '#947400',
					800: '#5C4800',
					900: '#241C00'
				}
			},
			fontFamily: {
				poppins: ['Poppins', ...defaultTheme.fontFamily.sans]
				// montserrat: ['Montserrat', ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: [
		require('@tailwindcss/forms')
		// ...
	]
}
