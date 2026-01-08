import type { Config } from 'tailwindcss'

export default <Config>{
    content: [
        './app/**/*.{vue,js,ts,jsx,tsx}',
        './content/**/*.md'
    ],
    theme: {
        extend: {
            colors: {
                background: '#0f172a', // Slate 900
                surface: '#1e293b',   // Slate 800
                primary: '#6366f1',   // Indigo 500
                secondary: '#ec4899', // Pink 500
                text: '#f8fafc',      // Slate 50
                muted: '#cbd5e1',     // Slate 300 (improved contrast)
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            container: {
                center: true,
                padding: '2rem',
                screens: {
                    '2xl': '1400px',
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
