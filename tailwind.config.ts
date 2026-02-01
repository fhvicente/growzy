import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: "class",
	content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "var(--color-border)",
				input: "var(--color-input)",
				ring: "var(--color-ring)",
				background: "var(--color-background)",
				foreground: "var(--color-foreground)",
				primary: {
					DEFAULT: "var(--color-primary)",
					foreground: "var(--color-primary-foreground)",
					50: "var(--color-primary-50)",
					100: "var(--color-primary-100)",
					200: "var(--color-primary-200)",
					300: "var(--color-primary-300)",
					400: "var(--color-primary-400)",
					500: "var(--color-primary-500)",
					600: "var(--color-primary-600)",
					700: "var(--color-primary-700)",
					800: "var(--color-primary-800)",
					900: "var(--color-primary-900)",
				},
				secondary: {
					DEFAULT: "var(--color-secondary)",
					foreground: "var(--color-secondary-foreground)",
				},
				destructive: {
					DEFAULT: "var(--color-destructive)",
					foreground: "var(--color-destructive-foreground)",
				},
				muted: {
					DEFAULT: "var(--color-muted)",
					foreground: "var(--color-muted-foreground)",
				},
				accent: {
					DEFAULT: "var(--color-accent)",
					foreground: "var(--color-accent-foreground)",
				},
				popover: {
					DEFAULT: "var(--color-popover)",
					foreground: "var(--color-popover-foreground)",
				},
				card: {
					DEFAULT: "var(--color-card)",
					foreground: "var(--color-card-foreground)",
				},
			},
			borderRadius: {
				lg: "var(--radius-lg)",
				md: "var(--radius-md)",
				sm: "var(--radius-sm)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"slide-in-right": {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.5s ease-out",
				"slide-in-right": "slide-in-right 0.3s ease-out",
			},
		},
	},
	plugins: [],
};

export default config;
