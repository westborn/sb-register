const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#085892',
				accent: '#FFCA05'
			},
			fontFamily: {
				poppins: ['Poppins', ...defaultTheme.fontFamily.sans]
			}
		}
	}
};
