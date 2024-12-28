import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  			'gradient-linear-green-white': 'linear-gradient(to right, #D4F3C0 69%, #EFFFF4 120%)',
  			'gradient-linear-navigation': 'linear-gradient(to right, #1B5A1B 10%, #D4F3C0 80%)',
			'gradient-linear-top': 'linear-gradient(to top, #D4F3C0 10%, #EFFFF4 80%)'
  		},
  		backgroundColor: {
  			primary: '#1b4a0aca',
  			'btn-primary': '#1B5A1B',
  			'btn-active': '#34762E',
			sidebar: 'var(--settings)',
  			hover: '#44de108f',
  			'secondary-btn': '#a3e279',
  			paleGreen: '#hsl(96, 75%, 89%)',
  			white: '#FAFAFA',
  			'btn-secondary': '#D4F3C0',
  			black: '#010101',
  			nav: '#D4F3C0',
  			content: '#DFDFDF'
  		},
  		colors: {
  			hover: '#44de108f',
  			paleGreen: '#hsl(96, 75%, 89%)',
  			white: '#FAFAFA',
  			black: '#010101',
  			nav: '#333333',
  			sidebar: 'var(--settings)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontSize: {
  			header: '2.5rem',
  			'h-15': '1.5rem'
  		},
  		borderWidth: {
  			'1': '1px'
  		},
  		borderColor: {
  			green: '#1B5A1B'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
